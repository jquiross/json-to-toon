/**
 * TOON (Tree Object Notation) Converter
 * 
 * TOON is a hierarchical data format designed for visual clarity:
 * - Uses indentation for nesting
 * - Simple key: value syntax
 * - Support for arrays with - prefix
 * - Comments with # or //
 * - Multi-line strings with |
 */

export class TOONConverter {
  constructor(options = {}) {
    this.options = {
      indentSize: options.indentSize || 2,
      sortKeys: options.sortKeys || false,
      preserveComments: options.preserveComments || true,
      maxDepth: options.maxDepth || 50,
      strictMode: options.strictMode || false,
    };
    this.errors = [];
    this.warnings = [];
    this.metrics = {
      processingTime: 0,
      inputSize: 0,
      outputSize: 0,
    };
  }

  /**
   * Convert JSON to TOON format
   */
  jsonToToon(jsonInput) {
    const startTime = Date.now();
    this.errors = [];
    this.warnings = [];

    try {
      // Parse JSON if string
      const jsonObj = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
      
      this.metrics.inputSize = JSON.stringify(jsonObj).length;
      const toonOutput = this._objectToToon(jsonObj, 0);
      this.metrics.outputSize = toonOutput.length;
      this.metrics.processingTime = Date.now() - startTime;

      return {
        success: true,
        output: toonOutput,
        errors: this.errors,
        warnings: this.warnings,
        metrics: this.metrics,
      };
    } catch (error) {
      this.errors.push({
        type: 'parse_error',
        message: error.message,
        line: null,
      });
      return {
        success: false,
        output: null,
        errors: this.errors,
        warnings: this.warnings,
        metrics: this.metrics,
      };
    }
  }

  /**
   * Convert TOON to JSON format
   */
  toonToJson(toonInput) {
    const startTime = Date.now();
    this.errors = [];
    this.warnings = [];
    this.metrics.inputSize = toonInput.length;

    try {
      const lines = toonInput.split('\n');
      const result = this._parseLines(lines);
      
      const jsonOutput = JSON.stringify(result, null, 2);
      this.metrics.outputSize = jsonOutput.length;
      this.metrics.processingTime = Date.now() - startTime;

      return {
        success: true,
        output: jsonOutput,
        parsed: result,
        errors: this.errors,
        warnings: this.warnings,
        metrics: this.metrics,
      };
    } catch (error) {
      this.errors.push({
        type: 'parse_error',
        message: error.message,
        line: null,
      });
      return {
        success: false,
        output: null,
        parsed: null,
        errors: this.errors,
        warnings: this.warnings,
        metrics: this.metrics,
      };
    }
  }

  /**
   * Convert JavaScript object to TOON string
   */
  _objectToToon(obj, depth = 0) {
    if (depth > this.options.maxDepth) {
      this.warnings.push({
        type: 'max_depth',
        message: `Maximum depth of ${this.options.maxDepth} exceeded`,
      });
      return '# [Max depth exceeded]';
    }

    const indent = ' '.repeat(depth * this.options.indentSize);
    let result = '';

    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          result += `${indent}-\n${this._objectToToon(item, depth + 1)}`;
        } else {
          result += `${indent}- ${this._formatValue(item)}\n`;
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      const keys = this.options.sortKeys ? Object.keys(obj).sort() : Object.keys(obj);
      
      keys.forEach(key => {
        const value = obj[key];
        
        if (value === null) {
          result += `${indent}${key}: null\n`;
        } else if (value === undefined) {
          result += `${indent}${key}: undefined\n`;
        } else if (Array.isArray(value)) {
          result += `${indent}${key}:\n${this._objectToToon(value, depth + 1)}`;
        } else if (typeof value === 'object') {
          result += `${indent}${key}:\n${this._objectToToon(value, depth + 1)}`;
        } else if (typeof value === 'string' && value.includes('\n')) {
          result += `${indent}${key}: |\n`;
          value.split('\n').forEach(line => {
            result += `${indent}  ${line}\n`;
          });
        } else {
          result += `${indent}${key}: ${this._formatValue(value)}\n`;
        }
      });
    } else {
      result = this._formatValue(obj);
    }

    return result;
  }

  /**
   * Format primitive values
   */
  _formatValue(value) {
    if (typeof value === 'string') {
      // Escape special characters
      if (value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return String(value);
  }

  /**
   * Parse TOON lines into object
   */
  _parseLines(lines) {
    const root = {};
    const stack = [{ obj: root, indent: -1 }];
    let currentMultiline = null;

    lines.forEach((line, lineNumber) => {
      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('#') || line.trim().startsWith('//')) {
        return;
      }

      const indent = line.search(/\S/);
      const trimmed = line.trim();

      // Handle multiline string continuation
      if (currentMultiline) {
        if (indent > currentMultiline.indent) {
          currentMultiline.lines.push(line.substring(currentMultiline.indent + 2));
          return;
        } else {
          // End of multiline
          const parent = stack[stack.length - 1].obj;
          parent[currentMultiline.key] = currentMultiline.lines.join('\n');
          currentMultiline = null;
        }
      }

      // Pop stack until we find the correct parent
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      // Array item
      if (trimmed.startsWith('-')) {
        if (!Array.isArray(parent)) {
          this.errors.push({
            type: 'syntax_error',
            message: 'Array item found in non-array context',
            line: lineNumber + 1,
          });
          return;
        }

        const value = trimmed.substring(1).trim();
        if (value) {
          parent.push(this._parseValue(value));
        } else {
          const newObj = {};
          parent.push(newObj);
          stack.push({ obj: newObj, indent });
        }
      }
      // Key-value pair
      else if (trimmed.includes(':')) {
        const colonIndex = trimmed.indexOf(':');
        const key = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();

        if (!key) {
          this.errors.push({
            type: 'syntax_error',
            message: 'Empty key found',
            line: lineNumber + 1,
          });
          return;
        }

        // Multiline string
        if (value === '|') {
          currentMultiline = {
            key,
            indent,
            lines: [],
          };
          return;
        }

        if (!value) {
          // Empty value means nested object or array
          const nextLine = lines[lineNumber + 1];
          if (nextLine && nextLine.trim().startsWith('-')) {
            parent[key] = [];
            stack.push({ obj: parent[key], indent });
          } else {
            parent[key] = {};
            stack.push({ obj: parent[key], indent });
          }
        } else {
          parent[key] = this._parseValue(value);
        }
      } else {
        this.warnings.push({
          type: 'syntax_warning',
          message: 'Line could not be parsed',
          line: lineNumber + 1,
        });
      }
    });

    return root;
  }

  /**
   * Parse string value to appropriate type
   */
  _parseValue(str) {
    const trimmed = str.trim();
    
    // Boolean
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    
    // Null/Undefined
    if (trimmed === 'null') return null;
    if (trimmed === 'undefined') return undefined;
    
    // Number
    if (!isNaN(trimmed) && trimmed !== '') {
      return Number(trimmed);
    }
    
    // String (remove quotes if present)
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1).replace(/\\"/g, '"');
    }
    
    return trimmed;
  }

  /**
   * Validate TOON syntax
   */
  validateToon(toonInput) {
    const lines = toonInput.split('\n');
    const issues = [];
    let indentStack = [0];

    lines.forEach((line, lineNumber) => {
      if (!line.trim() || line.trim().startsWith('#')) return;

      const indent = line.search(/\S/);
      const trimmed = line.trim();

      // Check indent consistency
      if (indent % this.options.indentSize !== 0) {
        issues.push({
          type: 'warning',
          message: 'Inconsistent indentation',
          line: lineNumber + 1,
          column: indent,
        });
      }

      // Check for invalid characters in keys
      if (trimmed.includes(':')) {
        const key = trimmed.split(':')[0];
        if (key.match(/[^\w\s-]/)) {
          issues.push({
            type: 'warning',
            message: 'Key contains special characters',
            line: lineNumber + 1,
          });
        }
      }
    });

    return {
      valid: issues.filter(i => i.type === 'error').length === 0,
      issues,
    };
  }

  /**
   * Optimize TOON output (remove duplicates, clean up)
   */
  optimize(toonInput) {
    // Remove empty lines
    let lines = toonInput.split('\n').filter(line => line.trim());
    
    // Remove duplicate consecutive empty keys
    lines = lines.filter((line, index) => {
      if (index === 0) return true;
      return !(line.trim() === '' && lines[index - 1].trim() === '');
    });

    return lines.join('\n');
  }

  /**
   * Generate human-readable explanation of JSON structure
   */
  explainJson(jsonInput) {
    try {
      const obj = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
      return this._explainObject(obj, '');
    } catch (error) {
      return `Error parsing JSON: ${error.message}`;
    }
  }

  _explainObject(obj, prefix = '') {
    let explanation = '';

    if (Array.isArray(obj)) {
      explanation += `${prefix}This is an array with ${obj.length} items.\n`;
      if (obj.length > 0) {
        const types = [...new Set(obj.map(item => typeof item))];
        explanation += `${prefix}Item types: ${types.join(', ')}\n`;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj);
      explanation += `${prefix}This is an object with ${keys.length} properties:\n`;
      keys.forEach(key => {
        const value = obj[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        explanation += `${prefix}  - ${key}: ${type}\n`;
        
        if (typeof value === 'object' && value !== null) {
          explanation += this._explainObject(value, prefix + '    ');
        }
      });
    }

    return explanation;
  }
}

export default TOONConverter;
