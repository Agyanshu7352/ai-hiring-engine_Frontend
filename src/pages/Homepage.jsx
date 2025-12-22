import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Target, TrendingUp, Users, Briefcase, ArrowRight, Star, Brain, Rocket, Award } from 'lucide-react';

const Home = () => {
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    const colors = [0x106EE8, 0x0FC1A1, 0x90E0AB, 0xCBFFCE];

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;

      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particlesGeometry.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.addAttribute('color', new THREE.BufferAttribute(colorArray, 3));


    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const shapes = [];
    
    const torusGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
    const torusMat = new THREE.MeshPhongMaterial({ 
      color: 0x106EE8, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.7 
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-3, 2, -3);
    scene.add(torus);
    shapes.push({ mesh: torus, speed: { x: 0.003, y: 0.005 } });

    const icoGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const icoMat = new THREE.MeshPhongMaterial({ 
      color: 0x0FC1A1, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.7 
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(3, -2, -4);
    scene.add(ico);
    shapes.push({ mesh: ico, speed: { x: 0.004, y: 0.003 } });

    const octGeo = new THREE.OctahedronGeometry(1, 0);
    const octMat = new THREE.MeshPhongMaterial({ 
      color: 0x90E0AB, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.7 
    });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(0, 3, -5);
    scene.add(oct);
    shapes.push({ mesh: oct, speed: { x: 0.002, y: 0.004 } });

    const dodecaGeo = new THREE.DodecahedronGeometry(0.8, 0);
    const dodecaMat = new THREE.MeshPhongMaterial({ 
      color: 0xCBFFCE, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.7 
    });
    const dodeca = new THREE.Mesh(dodecaGeo, dodecaMat);
    dodeca.position.set(-2, -3, -3);
    scene.add(dodeca);
    shapes.push({ mesh: dodeca, speed: { x: 0.005, y: 0.002 } });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x106EE8, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0FC1A1, 2, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;

      shapes.forEach((shape) => {
        shape.mesh.rotation.x += shape.speed.x;
        shape.mesh.rotation.y += shape.speed.y;
      });

      const targetX = mouseX * 0.3;
      const targetY = mouseY * 0.3;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Parsing",
      description: "Advanced NLP extracts skills, experience, and qualifications from resumes instantly with 95% accuracy",
      link:'/upload'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Matching",
      description: "ML algorithms calculate precise fit scores between candidates and job requirements in real-time",
      link:'/matches'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Gap Analysis",
      description: "Identify skill gaps and get personalized recommendations for candidate improvement paths",
      link:'/gap-analysis'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Interview Generator",
      description: "Auto-generate relevant technical and behavioral questions tailored to each specific role",
      link:'/#'
    }
  ];

  const stats = [
    { icon: <Users className="w-10 h-10" />, value: "50K+", label: "Resumes Analyzed" },
    { icon: <Briefcase className="w-10 h-10" />, value: "98%", label: "Accuracy Rate" },
    { icon: <Zap className="w-10 h-10" />, value: "2.5s", label: "Avg Parse Time" },
    { icon: <Star className="w-10 h-10" />, value: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #0d2847 25%, #0a4d5c 50%, #0b6e6e 75%, #0a1628 100%)'
    }}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" style={{ opacity: 0.9 }} />
      
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 20% 50%, rgba(16, 110, 232, 0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(15, 193, 161, 0.15), transparent 50%)'
      }} />
      
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border-2 mb-8 shadow-2xl"
            style={{ 
              background: 'rgba(15, 193, 161, 0.1)',
              borderColor: '#0FC1A1',
              opacity: Math.max(0, 1 - scrollY / 300) 
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: '#CBFFCE' }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: '#CBFFCE' }}>AI-Powered Recruitment Platform</span>
          </div>

          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            style={{ 
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: Math.max(0, 1 - scrollY / 400)
            }}
          >
            <span className="bg-gradient-to-r from-[#106EE8] via-[#0FC1A1] to-[#90E0AB] bg-clip-text text-transparent">
              Revolutionize Hiring
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">With AI Power</span>
          </h1>

          <p 
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ 
              color: '#CBFFCE',
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - scrollY / 400)
            }}
          >
            Automate resume screening • Match perfect candidates • Generate interview questions
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ 
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0, 1 - scrollY / 400)
            }}
          >
            <button
              onClick={()=>{navigate('/dashboard')}}
              className="group relative px-10 py-5 rounded-full text-white font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #106EE8, #0FC1A1)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0FC1A1] to-[#90E0AB] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Rocket className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="relative z-10" >Launch Dashboard</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              className="px-10 py-5 backdrop-blur-xl rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 border-2"
              style={{ 
                background: 'rgba(15, 193, 161, 0.1)',
                borderColor: '#0FC1A1'
              }}
            >
              <Award className="w-6 h-6" style={{ color: '#90E0AB' }} />
              View Demo
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 rounded-full flex justify-center p-2 border-2" style={{ borderColor: '#0FC1A1' }}>
              <div className="w-2 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom, #106EE8, #0FC1A1)' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-110 shadow-2xl"
                style={{
                  background: 'rgba(16, 110, 232, 0.1)',
                  borderColor: i === 0 ? '#106EE8' : i === 1 ? '#0FC1A1' : i === 2 ? '#90E0AB' : '#CBFFCE'
                }}
              >
                <div 
                  className="inline-flex p-4 rounded-2xl mb-6"
                  style={{ 
                    background: i === 0 ? 'rgba(16, 110, 232, 0.2)' : i === 1 ? 'rgba(15, 193, 161, 0.2)' : i === 2 ? 'rgba(144, 224, 171, 0.2)' : 'rgba(203, 255, 206, 0.2)'
                  }}
                >
                  {React.cloneElement(stat.icon, { 
                    style: { color: i === 0 ? '#106EE8' : i === 1 ? '#0FC1A1' : i === 2 ? '#90E0AB' : '#CBFFCE' } 
                  })}
                </div>
                <div className="text-5xl font-bold text-white mb-3 drop-shadow-lg">{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: '#90E0AB' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div 
              className="inline-block px-6 py-2 rounded-full backdrop-blur-xl border-2 mb-6"
              style={{ background: 'rgba(15, 193, 161, 0.1)', borderColor: '#0FC1A1' }}
            >
              <span className="font-bold text-sm tracking-wide" style={{ color: '#0FC1A1' }}>FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Powerful AI Capabilities
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#90E0AB' }}>
              Everything you need to transform your recruitment process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 overflow-hidden shadow-2xl"
                style={{
                  background: 'rgba(16, 110, 232, 0.1)',
                  borderColor: i === 0 ? '#106EE8' : i === 1 ? '#0FC1A1' : i === 2 ? '#90E0AB' : '#CBFFCE'
                }}
              >
                <div 
                  className="relative inline-flex p-4 rounded-2xl mb-6 shadow-lg"
                  style={{ 
                    background: i === 0 ? 'linear-gradient(135deg, #106EE8, #0FC1A1)' : 
                               i === 1 ? 'linear-gradient(135deg, #0FC1A1, #90E0AB)' : 
                               i === 2 ? 'linear-gradient(135deg, #90E0AB, #CBFFCE)' : 
                               'linear-gradient(135deg, #106EE8, #90E0AB)'
                  }}
                >
                  {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                </div>
                
                <h3 className="relative text-2xl font-bold text-white mb-4 drop-shadow-lg">{feature.title}</h3>
                <p className="relative leading-relaxed mb-6" style={{ color: '#CBFFCE' }}>{feature.description}</p>
                
                <div  onClick={()=>{navigate(feature.link)}} className="relative flex items-center gap-2 font-semibold group-hover:gap-4 transition-all">
                  <span style={{ color: '#0FC1A1' }}>Explore</span>
                  <ArrowRight className="w-5 h-5" style={{ color: '#0FC1A1' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto relative z-10">
          <div 
            className="relative p-16 rounded-[3rem] overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #106EE8, #0FC1A1, #90E0AB)' }}
          >
            <div className="relative text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                Ready to Hire Smarter?
              </h2>
              <p className="text-2xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow-lg">
                Join thousands of companies revolutionizing hiring with AI
              </p>
              <button
                onClick={()=>{navigate('/upload')}}
                className="group px-12 py-6 bg-white rounded-full font-bold text-xl transition-all duration-300 hover:scale-110 shadow-2xl inline-flex items-center justify-center gap-3"
                style={{ color: '#106EE8' }}
              >
                Get Started Free
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-16 px-4 border-t-2" style={{ borderColor: '#0FC1A1' }}>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#106EE8] to-[#0FC1A1] bg-clip-text text-transparent mb-4">
            AI Hiring Engine
          </h3>
          <p className="mb-8" style={{ color: '#90E0AB' }}>
            © 2025 AI Hiring Engine. Powered by Advanced Machine Learning.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="transition" style={{ color: '#CBFFCE' }}>Privacy Policy</a>
            <a href="#" className="transition" style={{ color: '#CBFFCE' }}>Terms of Service</a>
            <a href="#" className="transition" style={{ color: '#CBFFCE' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;