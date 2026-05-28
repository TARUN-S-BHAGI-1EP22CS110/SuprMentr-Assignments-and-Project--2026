import mongoose from "mongoose";
import dotenv from "dotenv";
import { Courses } from "./models/Courses.js";

dotenv.config();

const seedCourses = async () => {
  try {
    console.log("🔄 Starting seed...");

    await mongoose.connect(process.env.DB);
    console.log("✅ DB Connected");

    await Courses.deleteMany();
    console.log("🗑️ Old courses deleted");

    await Courses.insertMany([
      {
        title: "C Programming",
        description: "Strong foundation in C programming with pointers and memory management.",
        category: "Programming",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/c.jpg",
      },
      {
        title: "C++ Programming",
        description: "Learn OOP concepts and STL using C++.",
        category: "Programming",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/cpp.jpg",
      },
      {
        title: "Java Programming",
        description: "Core Java with multithreading and backend basics.",
        category: "Programming",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/java.jpg",
      },
      {
        title: "Python Programming",
        description: "Beginner to advanced Python with real-world applications.",
        category: "Programming",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/python.jpg",
      },
      {
        title: "Ruby Programming",
        description: "Learn Ruby fundamentals and Rails basics.",
        category: "Programming",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/ruby.png",
      },
      {
        title: "Data Structures & Algorithms",
        description: "DSA using C/C++/Python with problem-solving.",
        category: "DSA",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/dsa.jpg",
      },
      {
        title: "Microsoft Office",
        description: "Word, Excel, PowerPoint, Outlook from beginner to advanced.",
        category: "Office Tools",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/office.jpg",
      },
      {
        title: "Operating Systems",
        description: "Processes, scheduling, memory management, and Linux basics.",
        category: "System Core",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/os.jpg",
      },
      {
        title: "Cryptography",
        description: "Encryption, hashing, RSA, AES, and security basics.",
        category: "Security",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/crypto.jpg",
      },
      {
        title: "Cybersecurity",
        description: "Ethical hacking, malware, and network security.",
        category: "Security",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/cyber.jpg",
      },
      {
        title: "Mobile App Development",
        description: "Android, Flutter, Firebase, and app deployment.",
        category: "Mobile Development",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/mobile.png",
      },
      {
        title: "Computer Networks",
        description: "OSI model, TCP/IP, routing, and protocols.",
        category: "Networking",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/network.jpg",
      },
      {
        title: "Web Development",
        description: "Frontend + backend + MERN stack.",
        category: "Web Development",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/web.jpg",
      },
      {
        title: "DBMS",
        description: "SQL, normalization, transactions, and MongoDB.",
        category: "Database",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/dbms.jpg",
      },
      {
        title: "AI & Machine Learning",
        description: "ML models, neural networks, and data science basics.",
        category: "AI & Data Science",
        createdBy: "TARUN S BHAGI",
        duration: 600,
        price: 1,
        image: "uploads/ai.jpg",
      }
    ]);

    console.log("✅ All courses inserted successfully");
    process.exit(0);

  } catch (error) {
    console.log("❌ Error:", error);
    process.exit(1);
  }
};

seedCourses();