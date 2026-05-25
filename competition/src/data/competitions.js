import cookingImage from "../assets/cooking.jpg";
import fashionImage from "../assets/fashion.jpg";
import makeupImage from "../assets/makeup.jpg";
import jewelleryImage from "../assets/jwewllery.jpg";
import textileImage from "../assets/textile.jpg";
import stylingImage from "../assets/fashion.jpg";
import art from "../assets/art.jpg";
import acting from "../assets/acting.jpg";

export const competitions = [
  {
    id: 1,
    title: 'Divine Strokes: Women\'s Art Gallery',
    description: 'A platform for women artists to showcase their creativity across traditional and contemporary mediums.',
    type: 'free',
    prize: '₹50,000 + Exhibition Slot',
    deadline: 'June 15, 2026',
    participants: '1,200+',
    image: art,
    category: 'Artwork'
  },
  {
    id: 2,
    title: 'MasterChef Women\'s Edition',
    description: 'Showcase your culinary magic and traditional recipes in this high-stakes cooking challenge.',
    type: 'paid',
    price: '₹500 entry',
    prize: '₹2,00,000 + Professional Kit',
    deadline: 'July 01, 2026',
    participants: '850',
    image: cookingImage,
    category: 'Cooking'
  },
  {
    id: 3,
    title: 'Elite Fashion Runway 2026',
    description: 'Design and showcase your unique fashion collection inspired by heritage and modern trends.',
    type: 'paid',
    price: '₹1,500 entry',
    prize: '₹5,00,000 + Boutique Launch',
    deadline: 'August 10, 2026',
    participants: '400',
    image: fashionImage,
    category: 'Fashion'
  },
  {
    id: 4,
    title: 'Glamour Glow: Makeup Artistry',
    description: 'From bridal to conceptual makeup, show your skills in transforming beauty into art.',
    type: 'free',
    prize: '₹75,000 + Makeup Kit',
    deadline: 'May 30, 2026',
    participants: '2,500+',
    image: makeupImage,
    category: 'Makeup'
  },
  {
    id: 5,
    title: 'Jewellery Crafting Championship',
    description: 'Design intricate jewellery pieces using sustainable materials and traditional techniques.',
    type: 'paid',
    price: '₹750 entry',
    prize: '₹1,50,000 + Store Collaboration',
    deadline: 'September 12, 2026',
    participants: '600',
    image: jewelleryImage,
    category: 'Jewellery Making'
  },
  {
    id: 6,
    title: 'Textile Tales: Embroidery & Weaving',
    description: 'Preserving the art of hand-embroidery and weaving through creative storytelling.',
    type: 'free',
    prize: '₹40,000 + Artisan Grant',
    deadline: 'July 20, 2026',
    participants: '1,500+',
    image: textileImage,
    category: 'Craft'
  },
  {
    id: 7,
    title: 'Stage Stars: Acting Showcase',
    description: 'Demonstrate your acting prowess in monologues and scene work.',
    type: 'free',
    prize: '₹60,000 + Acting Workshop',
    deadline: 'October 05, 2026',
    participants: '300+',
    image: acting,
    category: 'Acting'
  },
  {
    id: 8,
    title: 'Style Maestro: Fashion Styling',
    description: 'Create standout looks for runway and editorial shoots.',
    type: 'paid',
    price: '₹1,000 entry',
    prize: '₹2,00,000 + Styling Portfolio',
    deadline: 'November 12, 2026',
    participants: '500',
    image: stylingImage,
    category: 'Styling'
  },
  {
    id: 9,
    title: 'Elegant Jewels: Jewellery Design',
    description: 'Craft elegant jewellery pieces with modern aesthetics.',
    type: 'free',
    prize: '₹80,000 + Exhibition Feature',
    deadline: 'December 01, 2026',
    participants: '400+',
    image: jewelleryImage,
    category: 'Jewellery'
  },
];
