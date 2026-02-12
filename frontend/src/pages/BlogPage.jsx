import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleBackToBlogs = () => {
    // This will reset the view to show all blogs
    setSelectedBlog(null);
    setLoading(true);
    navigate('/blogs'); // Explicitly navigate to blogs list
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
          if (!response.ok) throw new Error('Failed to fetch blog');
          const data = await response.json();
          if (isMounted) setSelectedBlog(data);
        } else {
          const response = await fetch('http://localhost:5000/api/blogs');
          if (!response.ok) throw new Error('Failed to fetch blogs');
          const data = await response.json();
          if (isMounted) setBlogs(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#DEF4FC]">
      {selectedBlog ? (
        <div className="max-w-4xl mx-auto ">
          <div className="flex gap-4 mb-6 ">
            <button
              onClick={handleBackToBlogs}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Back to all blogs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
          </div>

          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8 ">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedBlog.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-6">
                <span className="mr-4">By {selectedBlog.author}</span>
                <span>
                  {new Date(selectedBlog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="prose max-w-none">
                {Object.entries(selectedBlog.sections).map(([sectionNumber, section]) => (
                  <section key={sectionNumber} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </section>
                ))}
              </div>
            </div>
          </article>
        </div>
      ) : (
        <div>
          <button
            onClick={handleBackToHome}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
            aria-label="Back to home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>

          <h1 className="text-4xl font-bold text-center  mb-12 text-[#003459]">
            Our Latest Articles
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => handleBlogClick(blog._id)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer "
              >
                <div className="p-6 ">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <span className="mr-3">By {blog.author}</span>
                    <span>
                      {new Date(blog.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {blog.preview}
                  </p>
                  <div className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer inline-flex items-center">
                    <span>Read More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;