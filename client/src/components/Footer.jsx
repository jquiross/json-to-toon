import { Github, Twitter, Mail, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t-2 border-terminal-dim bg-terminal-bg/90 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-terminal-bright">
              JSON ⇄ TOON
            </h3>
            <p className="text-sm text-terminal-dim">
              The ultimate retro-inspired platform for JSON to TOON conversion.
              Built for developers, by developers. 🎮
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-terminal-bright">
              QUICK ACCESS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/converter" className="hover:text-terminal-bright transition-colors">
                  → Converter
                </a>
              </li>
              <li>
                <a href="/forum" className="hover:text-terminal-bright transition-colors">
                  → Forum
                </a>
              </li>
              <li>
                <a href="/achievements" className="hover:text-terminal-bright transition-colors">
                  → Achievements
                </a>
              </li>
              <li>
                <a href="/leaderboard" className="hover:text-terminal-bright transition-colors">
                  → Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-terminal-bright">
              CONNECT
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/jquiross"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terminal-bright transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/jeremy-quirós-84b746288/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terminal-bright transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="mailto:jeremyquiros03@gmail.com"
                className="hover:text-terminal-bright transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
            <p className="text-xs mt-4 text-terminal-dim">
              Press Ctrl+Alt+Win+Shift+L for a surprise 👾
            </p>
          </div>
        </div>

        <div className="border-t-2 border-terminal-dim mt-8 pt-4 text-center text-sm text-terminal-dim">
          <p>
            © {new Date().getFullYear()} JSON-TO-TOON Platform. Made with 💚 for
            developers.
          </p>
          <p className="mt-2 font-pixel text-xs">
            [ SYSTEM ONLINE | ALL SYSTEMS OPERATIONAL ]
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
