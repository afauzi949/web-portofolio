export interface Project {
  slug: string
  title: string
  description: string
  tag: string
  bgColor: string
  illustration: string
  technologies: string[]
  outcome: string
  github?: string
  // Extended details from PDF
  fullDescription: string
  systemArchitecture?: string[]
  keyFeatures: string[]
  systemFlow?: string[]
}

export const projects: Project[] = [
  {
    slug: "openstack-private-cloud",
    title: "OpenStack Private Cloud for AI & Microservices",
    description:
      "Built a private cloud infrastructure using OpenStack as an open-source alternative to VMware ESXi. The system runs virtualized microservices and AI workloads across three VMs: Data Lake with MongoDB, AI Worker Node with TensorFlow and YARA, and Analytics with ELK Stack. Processed 267+ security events with 71.91% classified as Critical Threats using AI-driven threat detection achieving 0.941 beaconing detection score.",
    tag: "Cloud Infrastructure",
    bgColor: "bg-[#6366F1]",
    illustration: "/cloud-computing-infrastructure.jpg",
    technologies: ["OpenStack", "MongoDB", "TensorFlow", "YARA", "ELK Stack", "Cowrie Honeypot", "Ubuntu Noble"],
    outcome: "267+ security events processed, 71.91% Critical Threats identified",
    fullDescription:
      "This project focuses on building an OpenStack-based Private Cloud as an open-source alternative to proprietary hypervisors like VMware ESXi. The infrastructure is designed to run microservices and AI workloads simultaneously in an isolated, scalable, and easily managed environment, specifically for cybersecurity research and academic computing needs. By leveraging OpenStack as an IaaS platform, this project demonstrates that a self-managed cloud can provide high flexibility, cost efficiency, and full control over resources without dependency on commercial vendors.",
    systemArchitecture: [
      "VM 1 - Data Lake & Management: Central raw data storage running MongoDB for storing honeypot logs, attack data, and malware samples at scale using flexible NoSQL schema.",
      "VM 2 - AI Worker Node: Primary compute node running Python, TensorFlow, Jupyter Notebook, and YARA for data preprocessing, static malware analysis, and machine learning-based threat classification.",
      "VM 3 - Analytics & Visualization: Running ELK Stack (Elasticsearch & Kibana) for indexing analysis results and real-time security data visualization.",
    ],
    keyFeatures: [
      "Full Open-Source Private Cloud using OpenStack (Nova, Neutron, Keystone, Glance, Horizon) eliminating vendor lock-in and providing full infrastructure control.",
      "Distributed AI Workload Processing with separation between data storage, AI processing, and visualization improving performance and scaling ease.",
      "AI-Driven Threat Detection capable of detecting automatic beaconing patterns with detection score up to 0.941, distinguishing human and bot traffic.",
      "Centralized Security Dashboard through Kibana for monitoring threat levels, attack trends, and malware activity distribution.",
      "Scalable IaaS Architecture enabling rapid VM provisioning to support growing research needs.",
    ],
    systemFlow: [
      "Data Collection: Honeypot (Cowrie) captures network attack activity and generates attack logs and malware data.",
      "Data Ingestion & Storage: Raw data is centrally stored in MongoDB on VM Data Lake ensuring consistency and easy access.",
      "Pre-processing Data: AI Worker Node retrieves data from MongoDB and performs normalization, metadata extraction, and data preparation for further analysis.",
      "Malware Analysis: Static analysis using YARA for malware signature detection and Machine learning analysis using TensorFlow for identifying beaconing patterns and automated activity.",
      "Threat Classification: Activities are classified into Low, Medium, and High/Critical Risk based on analysis scores.",
      "Indexing & Visualization: Analysis results are sent to Elasticsearch and visualized through Kibana dashboard for monitoring and security insight extraction.",
    ],
  },
  {
    slug: "container-monitoring-system",
    title: "Container Infrastructure Monitoring System",
    description:
      "Developed a centralized dashboard for managing and monitoring Docker-based container infrastructure within campus network. Features real-time log monitoring, system resource tracking (CPU, RAM, disk, network), and domain-based access management through reverse proxy configuration.",
    tag: "DevOps",
    bgColor: "bg-[#2F81F7]",
    illustration: "/portainer.jpg",
    technologies: ["Docker", "Portainer", "Dozzle", "cAdvisor", "Nginx Proxy Manager", "Bind9"],
    outcome: "Centralized control of all services, faster performance detection, efficient troubleshooting",
    fullDescription:
      "This project aims to manage and monitor container-based infrastructure centrally through a dashboard. The system is designed to simplify administrators in managing multiple Docker-based services, monitoring system performance, and performing application troubleshooting efficiently within the campus network environment.",
    keyFeatures: [
      "Centralized Container Management: Managing multiple containers (web services, monitoring services, and other supporting services) from a single centralized dashboard.",
      "System Resource Monitoring: Monitoring CPU, RAM, disk, and network usage for early bottleneck detection.",
      "Real-Time Log Monitoring: Displaying application logs in real-time to simplify debugging and error identification without direct server access.",
      "Domain & Access Management: Configuring internal service access through domains or subdomains for more structured and user-friendly services.",
    ],
    systemArchitecture: [
      "Docker: Containerization platform for running applications in isolated, consistent, and portable environments across different servers.",
      "Portainer: Main dashboard for managing container lifecycle, images, volumes, and Docker networks on local and remote servers.",
      "Dozzle: Displaying container logs in real-time through web interface without using command line.",
      "cAdvisor: Detailed container performance monitoring including resource usage and network traffic for system load analysis.",
      "Nginx Proxy Manager: Reverse proxy for domain and subdomain routing plus HTTP/HTTPS access and SSL certificate management.",
      "Bind9: Internal DNS server for managing domain and subdomain resolution within campus network environment.",
    ],
  },
  {
    slug: "car-price-mlops",
    title: "Car Price Prediction MLOps Pipeline",
    description:
      "Implemented end-to-end MLOps pipeline for car price regression covering data preprocessing, model training with XGBoost, deployment, and continuous monitoring. System includes experiment tracking with MLflow, production-ready API with FastAPI, responsive web interface with Next.js, and real-time observability using Prometheus and Grafana.",
    tag: "MLOps",
    bgColor: "bg-[#10B981]",
    illustration: "/mlops.jpg",
    technologies: ["Python", "XGBoost", "MLflow", "FastAPI", "Next.js", "Prometheus", "Grafana", "Docker", "Docker Compose"],
    outcome: "Production-ready prediction system with full lifecycle management and monitoring",
    fullDescription:
      "This project builds an end-to-end car price prediction system with MLOps approach, covering the entire machine learning lifecycle from data preprocessing, model training, deployment, monitoring, to continuous improvement. The system not only produces predictive models but also ensures models are production-ready, performance-monitored, and accessible through web interface and API.",
    keyFeatures: [
      "End-to-End MLOps Pipeline: System covers the entire machine learning cycle from data preprocessing, model training, deployment, to continuous performance monitoring.",
      "Responsive Web-Based Prediction Interface: Users can perform single and batch predictions through a responsive and easy-to-use web interface.",
      "Experiment Tracking & Model Versioning: Every experiment, hyperparameter tuning, and model evaluation result is recorded and managed using MLflow.",
      "Production-Ready API Layer: System provides scalable and well-documented prediction API to support integration with other systems.",
      "Monitoring & Observability: System and model performance is monitored in real-time to ensure reliability and prediction quality is maintained.",
    ],
    systemArchitecture: [
      "Python & XGBoost: Building and training car price regression model with high prediction performance.",
      "MLflow: Experiment tracking, model registry, and versioning for more controlled model deployment process.",
      "FastAPI: Fast and scalable backend API with input validation and automatic documentation support.",
      "Next.js: Responsive and interactive web frontend for prediction needs.",
      "Prometheus & Grafana: Real-time API, model, and system resource performance monitoring.",
      "Docker & Docker Compose: Ensuring environment consistency between development and production through containerization.",
    ],
  },
  {
    slug: "smart-farming-iot",
    title: "Smart Farming IoT Recommendation System",
    description:
      "Built an agricultural decision support system integrating IoT sensors, AI models, and web application. ESP32 collects soil condition data (moisture, pH, NPK) stored in MongoDB, processed by AI models to generate crop recommendations based on environmental factors and market prices. Results displayed through Streamlit dashboard.",
    tag: "IoT & AI",
    bgColor: "bg-[#22C55E]",
    illustration: "/smart-farming.jpg",
    technologies: ["Python", "ESP32", "MongoDB", "Streamlit"],
    outcome: "End-to-end agricultural recommendation system integrating IoT, AI, and web application",
    github: "https://github.com/afauzi949/smartfarming_detectsoil",
    fullDescription:
      "This project develops a smart farming system that integrates IoT sensors, AI models, and web applications for optimal crop recommendations based on real-time soil conditions and market price analysis. The system helps farmers make data-driven planting decisions for more efficient and sustainable agriculture.",
    keyFeatures: [
      "Real-Time Soil Monitoring: ESP32 sensors collect soil condition data including moisture, pH, and NPK levels continuously.",
      "AI-Based Crop Recommendation: Machine learning models process environmental data and market prices to generate optimal crop recommendations.",
      "Centralized Data Storage: MongoDB stores all sensor data and processing results in a scalable NoSQL database.",
      "Interactive Web Dashboard: Streamlit-based dashboard displays sensor data and crop recommendations in visual format.",
      "Market-Aware Decision Making: System considers both soil conditions and market prices for economically viable recommendations.",
    ],
    systemFlow: [
      "Sensors monitor soil conditions and transmit data via ESP32.",
      "Data is received and processed by AI model.",
      "System compares soil conditions with AI predictions and market price data.",
      "Best crop recommendations are generated.",
      "Results are displayed on Streamlit-based website.",
    ],
  },
  {
    slug: "pet-feeding-system",
    title: "Automated Pet Feeding System with IoT",
    description:
      "Designed IoT-based automated pet feeding system with real-time feed level monitoring using ultrasonic sensors, remote and scheduled feeding control, feeding history analytics, and multi-user role-based access control. Accessible via web dashboard and Telegram Bot integration for remote notifications and control.",
    tag: "IoT Development",
    bgColor: "bg-[#FFC224]",
    illustration: "/smart-feeding.jpg",
    technologies: ["ESP32", "Web Dashboard", "Telegram Bot", "Ultrasonic Sensor", "Docker"],
    outcome: "Automated feeding with remote monitoring, multi-user access, and containerized architecture",
    fullDescription:
      "Automated Pet Feeding System is a web-based IoT system designed to automate pet feeding process with real-time monitoring, remote control, and multi-user access support. This project was developed as part of Server Technology course, focusing on containerization, service-based architecture, and IoT integration with modern web applications. The system allows pet owners to monitor feed status, control feeding remotely, and set automatic feeding schedules through web dashboard and Telegram Bot integration.",
    keyFeatures: [
      "Real-Time Feed Level Monitoring: Ultrasonic sensor monitors feed availability in real-time and provides automatic notification when feed level is below certain threshold.",
      "Remote & Scheduled Feeding Control: Users can feed manually or schedule automatic feeding through web interface and Telegram Bot.",
      "Feeding History & Analytics: System stores feeding history and presents it in statistical visualization and timeline for easy monitoring of pet eating habits.",
      "Multi-User & Role-Based Access Control: System supports multiple users with Admin and User role division for safer and more structured access management and system control.",
      "Audio Notification System: Buzzer serves as sound notification during feeding process to provide direct feedback on device side.",
    ],
  },
  {
    slug: "cardiovascular-prediction",
    title: "Cardiovascular Risk Prediction with Ensemble Learning",
    description:
      "Developed machine learning system for early cardiovascular risk prediction using ensemble methods. Implemented feature engineering, data balancing, and compared Random Forest, Gradient Boosting, and XGBoost algorithms. Model evaluates demographic, physical, and behavioral factors to classify risk levels with improved stability over single-model approaches.",
    tag: "AI & Healthcare",
    bgColor: "bg-[#EF4444]",
    illustration: "/ensemble-learning.webp",
    technologies: ["Python", "Random Forest", "Gradient Boosting", "XGBoost", "Scikit-learn"],
    outcome: "Stable ensemble model reducing overfitting with identified key health risk factors",
    fullDescription:
      "This project focuses on applying ensemble learning to perform early cardiovascular disease risk prediction based on health and lifestyle factors. The system was developed as part of AI & Deep Learning course, with the goal of building an accurate, robust, and interpretable predictive model to support earlier disease prevention efforts. The model utilizes structured data covering demographic attributes, physical conditions, and behaviors to represent cardiovascular risk factors.",
    keyFeatures: [
      "Early Cardiovascular Risk Prediction: System designed to classify cardiovascular risk at early stage using health and lifestyle data as decision-making basis.",
      "Ensemble Learning-Based Modeling: Multiple machine learning algorithms combined to improve prediction performance and reduce overfitting risk compared to single model approach.",
      "Explainable Feature-Oriented Approach: Feature engineering and feature selection process performed to improve model interpretability and understand factors most influential on cardiovascular risk.",
    ],
    systemArchitecture: [
      "Data Preprocessing & Feature Engineering: Handling missing values, categorical feature encoding, class data balancing, and correlation-based feature selection to improve data quality and model performance.",
      "Ensemble Learning Models: Implementing and comparing several ensemble algorithms to obtain model with best generalization including Random Forest, Gradient Boosting, and XGBoost.",
      "Model Evaluation: Performance evaluation using classification metrics to measure accuracy, stability, and model generalization capability.",
    ],
  },
  {
    slug: "water-monitoring-iot",
    title: "IoT Water Usage Monitoring System",
    description:
      "Created IoT system for real-time PDAM water consumption monitoring with automated cost calculation based on official tariff rates. ESP32 reads water flow sensor data, processes volume and cost calculations, and displays results on LCD while transmitting data to users via Telegram Bot and Blynk mobile app.",
    tag: "Embedded Systems",
    bgColor: "bg-[#3B82F6]",
    illustration: "/water-monitoring.jpg",
    technologies: ["ESP32", "Water Flow Sensor", "LCD 2004", "Telegram Bot", "Blynk"],
    outcome: "Real-time water monitoring promoting consumption awareness and cost transparency",
    fullDescription:
      "This project develops an IoT-based PDAM water consumption monitoring system capable of calculating water usage and cost estimation in real-time. The system is designed to help users monitor monthly water usage transparently, increase consumption awareness, and encourage water conservation practices. By utilizing water flow sensors and ESP32 microcontroller, the system can measure water volume used, calculate costs based on PDAM tariff rules, and present data directly to users through various media.",
    keyFeatures: [
      "Real-Time Water Usage Monitoring: System measures water flow rate and volume used in real-time using water flow sensor for accurate consumption data.",
      "Automated Cost Calculation: Water usage data is processed to calculate cost estimation automatically based on applicable PDAM tariff scheme.",
      "Multi-Channel Data Visualization: Consumption and cost information displayed directly on LCD 2004 and sent to users via Telegram Bot and Blynk platform.",
      "Remote Monitoring & Notification: Users can monitor water usage remotely through mobile application and receive data updates periodically.",
      "Structured Development Approach: Project developed through structured stages from literature study, requirement analysis, system design, implementation, to evaluation.",
    ],
    systemArchitecture: [
      "ESP32: Used as main microcontroller for reading sensor data, processing calculations, and sending data in real-time.",
      "Water Flow Sensor: Used to measure water flow rate and volume as basis for consumption calculation.",
      "LCD 2004: Used to display water usage information and cost estimation directly on device.",
      "Telegram Bot API: Used as remote notification and monitoring media easily accessible by users.",
      "Blynk Platform: Used for real-time water consumption data visualization through mobile application.",
    ],
  },
  {
    slug: "secvalidator-security-header",
    title: "SecValidator API: Security Header Analyzer",
    description:
      "Developed a RESTful API service for analyzing and validating HTTP security headers on web applications. The API scans target URLs and evaluates critical security headers including Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, and more, providing detailed compliance reports and remediation recommendations.",
    tag: "Security API",
    bgColor: "bg-[#7C3AED]",
    illustration: "/sechead.jpg",
    technologies: ["Python", "FastAPI", "HTTP Headers", "Security Analysis", "REST API", "Docker"],
    outcome: "Automated security header validation API for web application security assessment",
    fullDescription:
      "SecValidator Security Header API is a specialized security tool designed to analyze and validate HTTP security headers on web applications. The API performs comprehensive scans of target URLs to evaluate the presence and configuration of critical security headers that protect against common web vulnerabilities such as clickjacking, XSS, and man-in-the-middle attacks. The service provides detailed compliance reports based on security best practices and OWASP guidelines, along with actionable remediation recommendations.",
    keyFeatures: [
      "Comprehensive Header Analysis: Evaluates all critical HTTP security headers including Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security (HSTS), and Referrer-Policy.",
      "Security Score Calculation: Generates an overall security score based on header presence, configuration quality, and compliance with security standards.",
      "Detailed Remediation Guidance: Provides specific recommendations for each missing or misconfigured header with example configurations.",
      "Batch URL Scanning: Supports scanning multiple URLs in a single request for efficient bulk security assessments.",
      "API Documentation: Well-documented RESTful endpoints with OpenAPI/Swagger specification for easy integration.",
    ],
    systemArchitecture: [
      "FastAPI Backend: High-performance Python framework handling API requests with automatic validation and documentation.",
      "Header Parser Module: Custom module for fetching and parsing HTTP response headers from target URLs.",
      "Security Rules Engine: Configurable rules engine that evaluates headers against security best practices and compliance standards.",
      "Report Generator: Generates structured JSON reports with findings, scores, and remediation steps.",
      "Docker Containerization: Fully containerized deployment for consistent and scalable operation.",
    ],
    systemFlow: [
      "Client sends target URL(s) to the API endpoint.",
      "API fetches HTTP headers from target URL using secure request methods.",
      "Header Parser extracts and normalizes all security-relevant headers.",
      "Security Rules Engine evaluates each header against predefined security criteria.",
      "Report Generator compiles findings into structured response with scores and recommendations.",
      "API returns comprehensive security assessment report to client.",
    ],
  },
  {
    slug: "secvalidator-password-strength",
    title: "SecValidator API: Password Strength Analyzer",
    description:
      "Built a RESTful API for comprehensive password strength analysis and validation. The API evaluates passwords against multiple security criteria including entropy calculation, common pattern detection, breach database checking, and compliance with security policies, providing detailed strength scores and improvement suggestions.",
    tag: "Security API",
    bgColor: "bg-[#DC2626]",
    illustration: "/password-checker.jpg",
    technologies: ["Python", "FastAPI", "Cryptography", "Security Analysis", "REST API", "Docker"],
    outcome: "Robust password validation API supporting secure authentication implementations",
    fullDescription:
      "SecValidator Password Strength API is a security-focused service designed to analyze and validate password strength for authentication systems. The API performs multi-layered analysis including entropy calculation, pattern detection, dictionary attack simulation, and checks against known breached password databases. It helps developers implement robust password policies by providing detailed strength assessments and actionable feedback for users to create stronger passwords.",
    keyFeatures: [
      "Entropy-Based Strength Calculation: Calculates password entropy to measure unpredictability and resistance against brute-force attacks.",
      "Common Pattern Detection: Identifies weak patterns such as keyboard walks, repeated characters, sequential numbers, and common substitutions.",
      "Breach Database Integration: Checks passwords against known compromised password databases to prevent use of previously breached credentials.",
      "Policy Compliance Validation: Validates passwords against configurable security policies including length, complexity, and character requirements.",
      "Detailed Feedback Generation: Provides specific, user-friendly suggestions for improving password strength.",
    ],
    systemArchitecture: [
      "FastAPI Backend: Async Python framework providing high-throughput password analysis endpoints.",
      "Entropy Calculator: Mathematical module computing Shannon entropy and effective bit strength of passwords.",
      "Pattern Analyzer: Detection engine identifying common weak patterns and predictable sequences.",
      "Breach Checker: Secure integration with breach databases using k-anonymity to protect queried passwords.",
      "Policy Engine: Configurable rules engine for custom password policy enforcement.",
      "Docker Deployment: Containerized service with secure configuration for production environments.",
    ],
    systemFlow: [
      "Client submits password to API endpoint (transmitted securely, never stored).",
      "Entropy Calculator computes mathematical strength score.",
      "Pattern Analyzer scans for common weak patterns and sequences.",
      "Breach Checker queries compromised password database using k-anonymity model.",
      "Policy Engine validates against configured security requirements.",
      "API returns comprehensive strength analysis with score and improvement suggestions.",
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug)
}


