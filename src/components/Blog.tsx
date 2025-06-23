import React from 'react';
import { Calendar, ChevronRight, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Dog Allergies: A Complete Guide',
    excerpt: 'Learn about the most common types of dog allergies, their symptoms, and how to identify if your pet is suffering from allergic reactions.',
    date: '2024-03-15',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Education'
  },
  {
    id: '2',
    title: 'The True Cost of Pet Allergy Treatment',
    excerpt: 'Discover how much pet owners typically spend on allergy medication and ways to make treatment more affordable without compromising quality.',
    date: '2024-03-10',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Cost & Savings'
  },
  {
    id: '3',
    title: 'Natural Remedies to Complement Allergy Treatment',
    excerpt: 'Explore complementary natural remedies that can help support your dog\'s allergy treatment and improve their overall well-being.',
    date: '2024-03-05',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/1870301/pexels-photo-1870301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Wellness'
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
        
        <a href="/blog" className="inline-flex items-center text-[#F9A826] font-medium hover:text-[#F9A826]/80 transition-colors">
          Read More
          <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
    </article>
  );
};

const Blog = () => {
  return (
    <section id="blog" className="py-16 md:py-24 bg-[#FFF8E8]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">
            Latest Pet Health Insights
          </h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Expert advice and tips for managing your dog's allergies and overall well-being
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/blog"
            className="inline-flex items-center bg-[#F9A826]/10 text-[#F9A826] font-semibold px-6 py-3 rounded-xl hover:bg-[#F9A826]/20 transition-colors"
          >
            View All Articles
            <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;