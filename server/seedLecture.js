import mongoose from "mongoose";
import dotenv from "dotenv";
import { Courses } from "./models/Courses.js";
import { Lecture } from "./models/Lecture.js";
import { Module } from "./models/Module.js";

dotenv.config();

const getEmbedUrl = (url) => {
  if (!url) return "";

  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("watch?v=")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
};

const courseLectures = {
 Programming: {

    "C Programming": [
      { title: "Introduction to C", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Variables & Data Types", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Input Output", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Operators", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "If Else", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Switch Case", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Loops", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Functions", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Arrays", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Strings", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Pointers", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Structures", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "File Handling", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Dynamic Memory", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Recursion", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Sorting", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Searching", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Bitwise Ops", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Preprocessor", videoUrl: "https://youtu.be/KJgsSFOSQv0" },
      { title: "Final Project", videoUrl: "https://youtu.be/KJgsSFOSQv0" }
    ],

    "C++ Programming": [
      { title: "Intro to C++", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Variables", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Data Types", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Operators", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "If Else", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Loops", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Functions", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Arrays", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Pointers", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Classes", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Constructors", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Inheritance", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Polymorphism", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Encapsulation", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Abstraction", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "STL Intro", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Vectors", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Maps", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "File Handling", videoUrl: "https://youtu.be/vLnPwxZdW4Y" },
      { title: "Final Project", videoUrl: "https://youtu.be/vLnPwxZdW4Y" }
    ],

    "Python Programming": [
      { title: "Intro to Python", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Variables", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Data Types", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "If Else", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Loops", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Functions", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Lists", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Tuples", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Sets", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Dictionaries", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Strings", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "File Handling", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "OOP", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Modules", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Exceptions", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Lambda", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Decorators", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Generators", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "NumPy", videoUrl: "https://youtu.be/_uQrJ0TkZlc" },
      { title: "Pandas", videoUrl: "https://youtu.be/_uQrJ0TkZlc" }
    ],
     "Java Programming": [
      { title: "Java Intro", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Variables", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Data Types", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Operators", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "If Else", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Loops", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Methods", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Arrays", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Strings", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "OOP", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Classes", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Inheritance", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Polymorphism", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Encapsulation", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Abstraction", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Exception Handling", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Threads", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Collections", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "File IO", videoUrl: "https://youtu.be/eIrMbAQSU34" },
      { title: "Final Project", videoUrl: "https://youtu.be/eIrMbAQSU34" }
    ],
"Ruby Programming": [
      { title: "Ruby Intro", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Variables", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Data Types", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Operators", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "If Else", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Loops", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Functions", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Arrays", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Strings", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Hashes", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Classes", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Modules", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Blocks", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Mixins", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "File Handling", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Gems", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Rails Intro", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "MVC", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Project", videoUrl: "https://youtu.be/t_ispmWmdjY" },
      { title: "Final Review", videoUrl: "https://youtu.be/t_ispmWmdjY" }
    ],

    "Data Structures & Algorithms": [
      { title: "Intro to DSA", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Arrays", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Strings", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Linked List", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Stack", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Queue", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Trees", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "BST", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Graphs", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Sorting", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Searching", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Recursion", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Backtracking", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Greedy", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "DP", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Bit Manipulation", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Complexity", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Problems", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Advanced Problems", videoUrl: "https://youtu.be/8hly31xKli0" },
      { title: "Final Revision", videoUrl: "https://youtu.be/8hly31xKli0" }
    ]


  },
   "Web Development": {
    "Web Development": [
      { title: "Introduction to Web", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "HTML Basics", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "CSS Basics", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Flexbox", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Grid Layout", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "JavaScript Intro", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "DOM", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Events", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Fetch API", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Node.js", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Express.js", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "MongoDB", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Mongoose", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Authentication", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "JWT", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "React Intro", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Hooks", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Deployment", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Performance", videoUrl: "https://youtu.be/ZxKM3DCV2kE" },
      { title: "Final Project", videoUrl: "https://youtu.be/ZxKM3DCV2kE" }
    ]
  },
  "System Core": {

  "Operating Systems": [
    { title: "Introduction to OS", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Types of OS", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Process vs Thread", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Process Control Block", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Context Switching", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "CPU Scheduling Basics", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "FCFS Scheduling", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "SJF Scheduling", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Round Robin", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Priority Scheduling", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Deadlocks", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Deadlock Prevention", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Banker’s Algorithm", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Memory Management", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Paging", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Segmentation", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Virtual Memory", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "File Systems", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Disk Scheduling", videoUrl: "https://youtu.be/26QPDBe-NB8" },
    { title: "Linux Basics", videoUrl: "https://youtu.be/26QPDBe-NB8" }
  ]

},
"Office Tools": {

  "Microsoft Office": [
    { title: "Introduction to MS Office", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "MS Word Basics", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Formatting in Word", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Tables in Word", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Mail Merge", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Excel Basics", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Excel Formulas", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Charts in Excel", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Pivot Tables", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "PowerPoint Basics", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Slide Design", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Animations", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Transitions", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Outlook Basics", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Email Management", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Calendar Usage", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Contacts", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Office Integration", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Cloud Features", videoUrl: "https://youtu.be/3u9lY0-7cH0" },
    { title: "Final Project", videoUrl: "https://youtu.be/3u9lY0-7cH0" }
  ]

},

 "Mobile Development": {
    "Mobile App Development": [
      { title: "Intro to Mobile Dev", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Android Basics", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Activities", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Layouts", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Intents", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "UI Design", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "UX Design", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "SQLite", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Firebase", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "API Integration", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Flutter Intro", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "React Native", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "State Management", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Push Notifications", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Testing Apps", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Debugging", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Performance", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Deployment", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Play Store", videoUrl: "https://youtu.be/fis26HvvDII" },
      { title: "Final Project", videoUrl: "https://youtu.be/fis26HvvDII" }
    ]
  },
  
"Security": {

  "Cryptography": [
    { title: "Intro to Cryptography", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "CIA Triad", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Symmetric Encryption", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "AES Algorithm", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "DES Algorithm", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Asymmetric Encryption", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "RSA", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "ECC", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Hash Functions", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "MD5", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "SHA Family", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Digital Signatures", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Certificates", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "PKI", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Diffie-Hellman", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Blockchain Basics", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "MITM Attack", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Brute Force", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Security Models", videoUrl: "https://youtu.be/jhXCTbFnK8o" },
    { title: "Final Review", videoUrl: "https://youtu.be/jhXCTbFnK8o" }
  ],

  "Cybersecurity": [
    { title: "Intro to Cybersecurity", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Threats", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Malware", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Viruses", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Trojans", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Ransomware", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Network Security", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Firewalls", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "IDS/IPS", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Authentication", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Authorization", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Ethical Hacking", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Reconnaissance", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Scanning", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Pen Testing", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "XSS", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "SQL Injection", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "CSRF", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Wireshark", videoUrl: "https://youtu.be/3Kq1MIfTWCE" },
    { title: "Final Project", videoUrl: "https://youtu.be/3Kq1MIfTWCE" }
  ]

},

 "Networking": {
    "Computer Networks": [
      { title: "Introduction to Networks", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "OSI Model", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "TCP/IP Model", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "IP Addressing", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Subnetting", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Routing", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Switching", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "HTTP", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "HTTPS", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "FTP", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "SMTP", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "DNS", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "DHCP", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Network Security", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Firewalls", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Congestion Control", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Error Detection", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Wireless Networks", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "5G Basics", videoUrl: "https://youtu.be/qiQR5rTSshw" },
      { title: "Final Revision", videoUrl: "https://youtu.be/qiQR5rTSshw" }
    ]
  },
 "Database": {
    "DBMS": [
      { title: "Introduction to DBMS", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "ER Model", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Relational Model", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "SQL Basics", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "CRUD", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Joins", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Subqueries", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Normalization", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Transactions", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "ACID", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Indexing", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Optimization", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "NoSQL", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "MongoDB", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Aggregation", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Replication", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Sharding", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Security", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Case Study", videoUrl: "https://youtu.be/dl00fOOYLOM" },
      { title: "Final Review", videoUrl: "https://youtu.be/dl00fOOYLOM" }
    ]
  },

 "AI & Data Science": {
    "AI & Machine Learning": [
      { title: "Intro to AI", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "ML Basics", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Supervised Learning", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Unsupervised Learning", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Regression", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Classification", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Clustering", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Data Preprocessing", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Feature Engineering", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Model Evaluation", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Neural Networks", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Deep Learning", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "CNN", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "RNN", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "NLP", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Python for ML", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Pandas", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Scikit-learn", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Projects", videoUrl: "https://youtu.be/7eh4d6sabA0" },
      { title: "Final Review", videoUrl: "https://youtu.be/7eh4d6sabA0" }
    ]
  }

};

const seedLectures = async () => {
  try {
    console.log("🔄 Seeding lectures...");

    await mongoose.connect(process.env.DB);
    console.log("✅ DB Connected");

    const courses = await Courses.find();

    await Lecture.deleteMany();
    await Module.deleteMany();

    console.log("🗑️ Old data cleared");

    for (const course of courses) {
      let lectures = null;

      for (const category in courseLectures) {
        if (courseLectures[category][course.title]) {
          lectures = courseLectures[category][course.title];
          break;
        }
      }

      if (!lectures) {
        console.log("❌ No lectures for:", course.title);
        continue;
      }

      console.log("✔ Adding:", course.title);

      // ✅ CREATE MODULE FIRST
      const module = await Module.create({
        title: "Module 1",
        course: course._id,
        order: 1,
        lectures: [],
      });

      for (let i = 0; i < lectures.length; i++) {
        const lec = await Lecture.create({
          title: lectures[i].title,
          description: lectures[i].title,
          videoUrl: getEmbedUrl(lectures[i].videoUrl),
          course: course._id,
          module: module._id,   // ✅ FIXED
          order: i + 1,
        });

        module.lectures.push(lec._id);
      }

      await module.save();
    }

    console.log("✅ ALL lectures inserted successfully");
    process.exit();

  } catch (err) {
    console.log("❌ ERROR:", err);
    process.exit(1);
  }
};

seedLectures();