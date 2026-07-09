const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace function App() with export default function Home()
code = code.replace(/function App\(\) \{/, 'export default function Home() {');
code = code.replace(/export default App;/g, '');

// Remove the Header component part
code = code.replace(/\{\/\* Navbar \*\/\}[\s\S]*?<\/header>/, '');

// Remove the Footer component part
code = code.replace(/\{\/\* Footer \*\/\}[\s\S]*?<\/footer>/, '');

// Remove the states for header
code = code.replace(/const \[isScrolled, setIsScrolled\] = useState\(false\);/, '');
code = code.replace(/const \[isMenuOpen, setIsMenuOpen\] = useState\(false\);/, '');

// Remove the handleScroll useEffect
code = code.replace(/useEffect\(\(\) => \{\s*const handleScroll = \(\) => \{\s*setIsScrolled\(window\.scrollY > 50\);\s*\};\s*window\.addEventListener\('scroll', handleScroll\);\s*return \(\) => window\.removeEventListener\('scroll', handleScroll\);\s*\}, \[\]\);/, '');
code = code.replace(/const toggleMenu = \(\) => setIsMenuOpen\(!isMenuOpen\);/, '');
code = code.replace(/const closeMenu = \(\) => setIsMenuOpen\(false\);/, '');

// Add auto scroll to hash useEffect
const hashScrollEffect = `
  const { hash } = window.location;
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);
`;
code = code.replace(/(export default function Home\(\) \{)/, '$1' + hashScrollEffect);

fs.writeFileSync('src/pages/Home.jsx', code);
console.log('Home.jsx created successfully.');
