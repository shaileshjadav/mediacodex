import { useState } from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { 
  PlayIcon, 
  CloudArrowUpIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  BoltIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DemoVideo from './DemoVideo';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const features = [
    {
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      title: "On-Demand Transcoding",
      description: "Upload videos in any format and get optimized streams instantly. Our intelligent transcoding engine handles everything automatically."
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: "Easy Embed Integration",
      description: "Copy and paste embed codes to integrate videos anywhere. Simple, responsive, and works on any website or platform."
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "CloudFront Security",
      description: "Enterprise-grade security with AWS CloudFront and signed cookies. Your content is protected and delivered globally."
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Global CDN delivery ensures your videos load instantly anywhere in the world. Optimized for performance and reliability."
    }
  ];

  // const stats = [
  //   { number: "99.9%", label: "Uptime Guarantee" },
  //   { number: "150+", label: "Countries Served" },
  //   { number: "<2s", label: "Average Load Time" },
  //   { number: "24/7", label: "Support Available" }
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-8 shadow-2xl">
              <PlayIcon className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Enterprise-ready
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Adaptive Video Transcoding
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your video content with our cutting-edge transcoding service. 
              Upload, process, and stream videos globally with enterprise-grade security and lightning-fast delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <SignInButton>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </SignInButton>
              
              {/* <button 
                className="flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                onClick={() => setShowDemoModal(true)}
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="block text-blue-600">Video Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines powerful transcoding technology with seamless integration tools, 
              giving you everything needed to deliver exceptional video experiences.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                        : 'bg-white text-gray-600'
                    } shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4 text-sm font-mono">
                  <div className="text-green-400">
                    <span className="text-gray-500">$</span> curl -X POST https://api.videoplatform.com/upload
                  </div>
                  <div className="text-blue-400 pl-4">
                    {'--data \'{"file": "video.mp4", "quality": "1080p"}\''}
                  </div>
                  <div className="text-gray-400 pl-4">
                    --header "Authorization: Bearer your-token"
                  </div>
                  <div className="text-yellow-400 mt-4">
                    ✓ Upload successful
                  </div>
                  <div className="text-green-400">
                    ✓ Transcoding initiated
                  </div>
                  <div className="text-blue-400">
                    ✓ CDN distribution complete
                  </div>
                  <div className="text-purple-400">
                    → Embed code ready: {"<iframe src=\"...\">"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple. Powerful. Secure.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your videos streaming in minutes with our streamlined workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <CloudArrowUpIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Video</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop your video files or use our API. We support all major formats and handle the rest automatically.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <BoltIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatic Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered transcoding engine optimizes your videos for multiple devices and streaming qualities.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <GlobeAltIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Your videos are distributed worldwide via CloudFront CDN with secure signed cookies for protected access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embed Code Preview Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Embed Anywhere
                <span className="block text-blue-600">In Seconds</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get responsive, customizable embed codes that work perfectly on any website, 
                blog, or application. No technical expertise required.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Responsive Design</h4>
                    <p className="text-gray-600">Automatically adapts to any screen size</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Analytics Ready</h4>
                    <p className="text-gray-600">Track views, engagement, and performance</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure by Default</h4>
                    <p className="text-gray-600">Built-in protection and access controls</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm">embed-code.html</span>
              </div>
              
              <div className="space-y-2 text-sm font-mono">
                <div className="text-gray-500">{'<!-- Simple embed code -->'}</div>
                <div className="text-blue-400">{'<iframe'}</div>
                <div className="text-green-400 pl-4">{'src="https://embed.videoplatform.com/v/abc123"'}</div>
                <div className="text-green-400 pl-4">{'width="100%"'}</div>
                <div className="text-green-400 pl-4">{'height="400"'}</div>
                <div className="text-green-400 pl-4">{'frameborder="0"'}</div>
                <div className="text-green-400 pl-4">{'allowfullscreen'}</div>
                <div className="text-blue-400">{'></iframe>'}</div>
                <div className="text-gray-500 mt-4">{'<!-- That\'s it! -->'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Videos?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of creators and businesses who trust our platform for their video needs. 
            Start your free trial today and experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <SignInButton>
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Start Free Trial
              </button>
            </SignInButton>
            <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Platform Demo</h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <DemoVideo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;