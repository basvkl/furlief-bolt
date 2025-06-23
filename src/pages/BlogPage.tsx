import React from 'react';
import { Calendar, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  content?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Dog Allergies: A Complete Guide',
    excerpt: 'Learn about the most common types of dog allergies, their symptoms, and how to identify if your pet is suffering from allergic reactions.',
    date: '2024-03-15',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Education',
    content: 'Full article content would go here...'
  },
  {
    id: '2',
    title: 'The True Cost of Pet Allergy Treatment',
    excerpt: 'Discover how much pet owners typically spend on allergy medication and ways to make treatment more affordable without compromising quality.',
    date: '2024-03-10',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Cost & Savings',
    content: 'Full article content would go here...'
  },
  {
    id: '3',
    title: 'Natural Remedies to Complement Allergy Treatment',
    excerpt: 'Explore complementary natural remedies that can help support your dog\'s allergy treatment and improve their overall well-being.',
    date: '2024-03-05',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/1870301/pexels-photo-1870301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Wellness',
    content: 'Full article content would go here...'
  },
  {
    id: '4',
    title: 'Seasonal Allergies in Dogs: What You Need to Know',
    excerpt: 'Understanding how seasonal changes affect your dog\'s allergies and steps to minimize discomfort throughout the year.',
    date: '2024-03-01',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Education',
    content: 'Full article content would go here...'
  },
  {
    id: '5',
    title: 'How to Create an Allergy-Safe Environment for Your Dog',
    excerpt: 'Tips and tricks for reducing allergens in your home and creating a comfortable space for your allergic pet.',
    date: '2024-02-25',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1350593/pexels-photo-1350593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Lifestyle',
    content: 'Full article content would go here...'
  },
  {
    id: '6',
    title: 'Diet and Allergies: The Connection You Need to Know',
    excerpt: 'Exploring the relationship between your dog\'s diet and allergy symptoms, including food recommendations.',
    date: '2024-02-20',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/1350591/pexels-photo-1350591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Nutrition',
    content: 'Full article content would go here...'
  }
];

const BlogCard = ({ post }: { post: BlogPost }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[#0E2A47] text-sm font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-[#0E2A47]/70 mb-3">
          <Calendar size={16} className="mr-2" />
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <Clock size={16} className="mr-2" />
          <span>{post.readTime}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-[#0E2A47] mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-[#0E2A47]/80 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <button className="inline-flex items-center text-[#F9A826] font-medium hover:text-[#F9A826]/80 transition-colors">
          Read More
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </article>
  );
};

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="mb-8">
            <a
              href="/"
              className="inline-flex items-center text-[#0E2A47] hover:text-[#F9A826] transition-colors mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </a>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0E2A47] mb-4">
              Pet Health Blog
            </h1>
            <p className="text-xl text-[#0E2A47]/80">
              Expert insights on pet allergies, treatment options, and care tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;