# VENTLY – A FULL STACK EMOTION-BASED SOCIAL PLATFORM

---

## **COVER PAGE**

<br><br><br><br>

# **VENTLY – A FULL STACK EMOTION-BASED SOCIAL PLATFORM**

### **A Project Report**

<br><br>

**Submitted in partial fulfillment of the requirements for the degree of**
### **Bachelor of Engineering in Computer Science Engineering**

<br>

**Submitted by:**
**[Student Name 1] ([Roll Number 1])**
**[Student Name 2] ([Roll Number 2])**

<br>

**Under the Guidance of:**
**[Supervisor Name]**
**Assistant Professor, Department of CSE**

<br><br>

![University Logo Placeholder]

<br>

### **DEPARTMENT OF COMPUTER SCIENCE ENGINEERING**
### **CHANDIGARH UNIVERSITY, GHARUAN**
### **APRIL 2026**

---

## **BONAFIDE CERTIFICATE**

<br>

### **CHANDIGARH UNIVERSITY**
### **DEPARTMENT OF COMPUTER SCIENCE ENGINEERING**

<br>

**CERTIFICATE**

This is to certify that the project report entitled **"VENTLY – A FULL STACK EMOTION-BASED SOCIAL PLATFORM"** is a bonafide work carried out by **[Student Names]** in partial fulfillment of the requirements for the degree of Bachelor of Engineering in Computer Science Engineering at Chandigarh University. This work has been carried out under my supervision and guidance.

The results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.

<br><br><br>

**[Signature]**  
**Head of Department**  
Department of CSE  
Chandigarh University  

<br><br>

**[Signature]**  
**Supervisor**  
Assistant Professor, CSE  
Chandigarh University  

<br><br>

**[Signature]**  
**Internal Examiner**  

<br><br>

**[Signature]**  
**External Examiner**  

---

## **TABLE OF CONTENTS**

| No. | Section | Page No. |
| :--- | :--- | :--- |
| | **Abstract** | |
| | **Graphical Abstract** | |
| | **Abbreviations** | |
| | **Symbols** | |
| **1** | **CHAPTER 1: INTRODUCTION** | |
| 1.1 | Client Identification | |
| 1.2 | Problem Identification | |
| 1.3 | Identification of Tasks | |
| 1.4 | Timeline & Gantt Chart | |
| 1.5 | Organization of Report | |
| **2** | **CHAPTER 2: DESIGN FLOW / PROCESS** | |
| 2.1 | Feature Selection | |
| 2.2 | Constraints | |
| 2.3 | Analysis (Comparative Study) | |
| 2.4 | Design Flow & User Journey | |
| 2.5 | Methodology (MVC Architecture) | |
| **3** | **CHAPTER 3: IMPLEMENTATION** | |
| 3.1 | Technical Stack Overview | |
| 3.2 | Frontend Development | |
| 3.3 | Backend Development | |
| 3.4 | Database Schema & Management | |
| 3.5 | AI Integration & Security | |
| **4** | **CHAPTER 4: CONCLUSION AND FUTURE WORK** | |
| 4.1 | Conclusion | |
| 4.2 | Future Scope | |
| | **REFERENCES** | |

---

## **ABSTRACT**

**Vently** is an innovative, full-stack social ecosystem designed to address the growing global mental health crisis and the "loneliness epidemic" exacerbated by traditional social media. Unlike mainstream platforms that focus on curated highlight reels, Vently creates a safe, anonymous haven for genuine emotional expression. The purpose of this project is to provide a comprehensive digital toolkit for mental wellness, integrating empathetic AI technology with holistic healing practices.

The core of Vently is its **Emotion-Based Expression System**, where users can "vent" their thoughts and feelings without the fear of judgment or social repercussions. This is supported by a 24/7 **AI Chatbot**, which uses advanced Large Language Models (LLMs) to provide immediate, personalized emotional support and sentiment-aware responses. 

Furthermore, the platform features a dedicated **Healing Space**—a curated environment offering physical and mental rejuvenation through Yoga asanas and guided meditations. This space is uniquely integrated with external multimedia platforms like **YouTube and Spotify**, providing users with a seamless transition from emotional processing to active relaxation. 

Built on a robust tech stack—**Next.js (React), Node.js, Express, and MongoDB**—the platform ensures high availability, real-time interactivity, and secure data handling. The implementation of **JWT-based authentication** and **OTP verification** ensures that user privacy is never compromised. Vently serves as a bridge between social networking and therapeutic support, aiming to reduce the stigma around mental health while providing an accessible, free-to-use platform for emotional relief.

---

## **GRAPHICAL ABSTRACT**

### **Conceptual Flow Diagram**

**User State: BEFORE**  
- **Symptoms:** High stress, feeling unheard, emotional suppression, anxiety.  
- **Context:** Isolated in traditional social media environments.

**Process: DURING**  
1.  **Emotion Entry:** User selects a mood or types a "vent" into the AI interface.  
2.  **AI Interaction:** Vently AI processes the sentiment and responds with empathy and validation.  
3.  **Wellness Recommendation:** The system suggests a specific Yoga pose or a Spotify meditation playlist based on the user's state.  
4.  **Healing Action:** User engages with curated multimedia content.

**User State: AFTER**  
- **Outcome:** Emotional release, reduced cortisol levels, feeling understood, mental clarity.

**Technical Logic Flow:**  
`User Input → NLP Analysis (AI) → Sentiment Matching → Response Generation → Actionable Wellness Links (YouTube/Spotify) → Data Persistence (MongoDB)`

---

## **ABBREVIATIONS**

| Abbreviation | Full Form |
| :--- | :--- |
| **API** | Application Programming Interface |
| **DB** | Database |
| **UI/UX** | User Interface / User Experience |
| **AI** | Artificial Intelligence |
| **JWT** | JSON Web Token |
| **REST** | Representational State Transfer |
| **CRUD** | Create, Read, Update, Delete |
| **CPU** | Central Processing Unit |
| **SSR** | Server-Side Rendering |
| **MVC** | Model-View-Controller |
| **NLP** | Natural Language Processing |
| **OTP** | One-Time Password |
| **LLM** | Large Language Model |
| **CDN** | Content Delivery Network |

---

## **SYMBOLS**

| Symbol | Description |
| :--- | :--- |
| **T(n)** | Time Complexity: Measurement of the time taken by an algorithm to run. |
| **S(n)** | Space Complexity: Measurement of the memory consumed by an algorithm. |
| **n** | Input size: Represents the number of concurrent users or data entries. |
| **f(n)** | Growth rate: Mathematical function representing algorithm efficiency. |
| **O(log n)** | Logarithmic time complexity (Search operations in optimized DB). |
| **O(1)** | Constant time complexity (ID-based lookups). |

---

## **CHAPTER 1: INTRODUCTION**

### **1.1 Client Identification**
The development of Vently was driven by identifying several key "clients" or user personas who are currently underserved by existing social platforms:

*   **The Silent Introvert:** Users who have deep emotional lives but feel "socially paralyzed" when it comes to sharing feelings on public profiles linked to their real identity.
*   **The High-Stress Student:** Particularly in competitive academic environments like Chandigarh University, students face immense pressure. Vently provides a 24/7 outlet for this stress.
*   **Anxious Expressers:** Individuals who need to talk through their problems but fear being a "burden" to friends or family.
*   **Holistic Wellness Seekers:** Users who are looking for a single dashboard that combines mental expression with physical movement (Yoga).

### **1.2 Problem Identification**
The "Social Media Paradox" suggests that while we are more connected than ever, loneliness and anxiety are at all-time highs.

**The Core Problems:**
1.  **The "Highlight Reel" Culture:** Traditional platforms like Instagram encourage users to post only positive content, leading to a suppression of negative emotions.
2.  **Lack of Safe Anonymity:** Most platforms require real identities, which leads to "self-censorship" due to fear of professional or social judgment.
3.  **Delayed Support:** Traditional therapy requires appointments and high costs. There is no "instant" emotional first-aid.
4.  **Mental Health Stigma:** Despite progress, many still find it difficult to admit they need help.

**Problem Statement:**  
To design and develop a full-stack, anonymous, emotion-based platform that provides immediate AI-driven empathetic support and holistic wellness tools to reduce the barrier to emotional expression and mental health support.

### **1.3 Identification of Tasks**
The project was broken down into several high-level tasks, each with specific sub-objectives:

1.  **Requirement Analysis & Research:**  
    *   Researching sentiment analysis libraries.  
    *   Selecting the MERN (MongoDB, Express, React, Node) stack for scalability.
2.  **UI/UX Design Phase:**  
    *   Designing a "Calm" theme using CSS variables and glassmorphism.  
    *   Creating responsive layouts for mobile and desktop.
3.  **Frontend Development:**  
    *   Implementing Next.js App Router for optimized navigation.  
    *   Building the "Healing Space" with dynamic filtering.
4.  **Backend & Database Development:**  
    *   Designing Mongoose schemas for asanas, meditations, and users.  
    *   Building a secure Admin API for content management.
5.  **AI & External API Integration:**  
    *   Connecting the Groq/Llama-3 API for the chatbot.  
    *   Integrating Cloudinary for multimedia storage.
6.  **Security & Authentication:**  
    *   Implementing JWT-based login and password hashing.  
    *   Integrating Nodemailer for OTP-based email verification.

### **1.4 Timeline & Gantt Chart**

The project followed a rigorous 4-week development cycle:

| Week | Activity | Deliverables |
| :--- | :--- | :--- |
| **Week 1** | **Concept & Architecture** | ER Diagrams, Wireframes, Environment Setup. |
| **Week 2** | **Frontend Implementation** | Landing Page, Navbar, Healing Space UI, Admin UI. |
| **Week 3** | **Backend & AI Logic** | REST APIs, Database seeding, AI Chatbot integration. |
| **Week 4** | **Testing & Optimization** | Load testing, Hydration fixes, Vercel deployment. |

### **1.5 Organization of Report**
This report is structured to guide the reader through the full engineering lifecycle of Vently.
*   **Chapter 1** provides the context and problem definition.
*   **Chapter 2** explains the design decisions and the methodology used to build the system.
*   **Chapter 3** dives into the actual implementation, showing how different technologies interact.
*   **Chapter 4** summarizes the achievements and provides a vision for the future of the platform.

---

## **CHAPTER 2: DESIGN FLOW / PROCESS**

### **2.1 Feature Selection**
The features of Vently were selected based on the "3 Pillars of Wellness":
1.  **Expression (AI Chatbot):** Allows for verbal/textual emotional release.
2.  **Physicality (Yoga Space):** Encourages movement to release physical tension.
3.  **Stillness (Meditation Space):** Integrated with Spotify to provide auditory calming.
4.  **Control (Admin Panel):** Ensures the platform remains up-to-date and safe.

### **2.2 Constraints**
Building a production-ready social platform involves navigating several constraints:
*   **Technical Constraint:** Ensuring that the AI chatbot remains responsive under high load (solved by using Groq's high-speed inference).
*   **Financial Constraint:** Using entirely open-source or free-tier cloud services to minimize costs.
*   **Accessibility Constraint:** The UI must be intuitive for users in a state of high emotional distress.
*   **Privacy Constraint:** Strict adherence to data protection, ensuring "vent" data is treated with extreme sensitivity.

### **2.3 Analysis (Comparative Study)**
Before choosing our stack, we analyzed several alternatives:
*   **Web App vs. Native Mobile App:** We chose a Web App (Next.js) because it requires no installation, reducing the friction for a user who needs to vent "immediately."
*   **SQL vs. NoSQL:** MongoDB (NoSQL) was selected over MySQL because emotional data is often unstructured and the schema needs to be flexible as new features are added.

### **2.4 Design Flow & User Journey**
**The User Journey:**
1.  **Discovery:** User lands on the calm, glassmorphic hero page.
2.  **Interaction:** User clicks the chat button and shares their current feeling.
3.  **Processing:** The AI processes the mood and provides a response.
4.  **Redirection:** If the user is "stressed," the system suggests the Healing Space.
5.  **Healing:** User selects a Yoga pose, views the video, and follows the benefits.

### **2.5 Methodology (MVC Architecture)**
We utilized the **Model-View-Controller (MVC)** design pattern:
*   **Model:** Defined in `src/lib/mongodb/models.ts`, representing the data structures.
*   **View:** The React components in `src/app` and `src/components`, which render the data.
*   **Controller:** The API routes in `src/app/api`, which handle the business logic and database interactions.

---

## **CHAPTER 3: IMPLEMENTATION**

### **3.1 Technical Stack Overview**
*   **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion.
*   **Backend:** Node.js, Express, Next.js API Routes.
*   **Database:** MongoDB Atlas (NoSQL).
*   **AI:** Groq SDK (Llama-3-70b model).
*   **Media:** Cloudinary (Image/Video hosting).
*   **Deployment:** Vercel (CI/CD integration).

### **3.2 Frontend Development**
The frontend was designed with a "Glassmorphism" aesthetic to evoke a sense of transparency and calm.
*   **Framer Motion:** Used to create the floating background circles and smooth page transitions.
*   **Responsive Design:** Using Tailwind's grid and flexbox to ensure the app works on iPhones, Androids, and Desktops.
*   **Dynamic Hydration:** Special attention was paid to fixing hydration mismatches to ensure a smooth First Contentful Paint (FCP).

### **3.3 Backend Development**
The backend follows a RESTful architecture.
*   **API Routes:** For example, `/api/admin/yoga` handles CRUD operations for yoga poses.
*   **Middleware:** We use middleware for admin authentication and error handling.
*   **Cloudinary Integration:** File uploads are handled on the server side to ensure security before being sent to the CDN.

### **3.4 Database Schema & Management**
Our MongoDB schema is designed for performance.
```typescript
// Example: Yoga Asana Schema
{
  name: String,
  images: [String],
  benefits: [String],
  howItHelps: String,
  bodyParts: [String],
  youtubeLink: String
}
```
This flexible structure allowed us to easily upgrade from a single image to an array of images based on user feedback.

### **3.5 AI Integration & Security**
The "Vently AI" chatbot is the crown jewel of the implementation.
*   **Prompt Engineering:** We use specific system prompts to ensure the AI remains empathetic, non-judgmental, and wellness-focused.
*   **JWT Security:** Every admin action is protected by a JSON Web Token, stored securely to prevent unauthorized content changes.

---

## **CHAPTER 4: CONCLUSION AND FUTURE WORK**

### **4.1 Conclusion**
The development of **Vently** has successfully addressed the primary goal of creating a safe, anonymous, and holistic emotional wellness platform. By integrating AI-driven empathy with physical wellness tools, the project bridges a critical gap in the current social media landscape. The use of a modern full-stack architecture ensures that the platform is not only functional but also scalable and secure. This project stands as a testament to the power of Computer Science Engineering in solving real-world human problems.

### **4.2 Future Scope**
While the current version of Vently is a complete product, there are several exciting paths for expansion:
1.  **AI Voice Synthesis:** Allowing users to "hear" the AI's empathetic voice for a more human-like experience.
2.  **Wearable Integration:** Connecting with smartwatches to suggest a "venting session" if the user's heart rate indicates high stress.
3.  **Community Safe-Zones:** Group chats where users with similar emotions can support each other anonymously.
4.  **Advanced Sentiment Analytics:** Providing users with a weekly "Emotion Map" to track their mental health progress over time.

---

## **REFERENCES**

**Academic Books:**
1.  Pressman, R. S. (2019). *Software Engineering: A Practitioner's Approach*. McGraw-Hill Education.
2.  Banks, A., & Porcello, E. (2020). *Learning React: Modern Patterns for Developing React Apps*. O'Reilly Media.

**Documentation & Web Resources:**
1.  **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs) (Server Components and App Router).
2.  **MongoDB Atlas:** [https://www.mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas) (Database scaling and aggregation).
3.  **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs) (Utility-first styling patterns).
4.  **Groq AI:** [https://console.groq.com/docs](https://console.groq.com/docs) (Llama-3 integration).
5.  **Cloudinary:** [https://cloudinary.com/documentation](https://cloudinary.com/documentation) (Multimedia API).

**End of Report**
