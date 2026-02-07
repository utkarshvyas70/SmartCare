# CarePath: A Modern Healthcare Web Platform



## 🌟 Project Overview

CarePath is a comprehensive, full-stack healthcare web application designed to create a bridge between patients and verified medical professionals. The platform's core mission is to democratize health knowledge and simplify the process of finding and consulting with doctors. By offering a powerful, searchable disease database and a streamlined appointment booking system, CarePath provides an intuitive and trustworthy experience. The application is built with a strong focus on modern web development practices, ensuring a highly responsive design and a seamless, user-centric experience across all devices. This project serves as a showcase of proficiency in a full-stack, in-demand technology stack, from secure authentication to robust data management.

---

## 👩‍⚕️ Key Features & Roles

The application's architecture is centered around a robust role-based system, which provides distinct and tailored functionalities for both users (patients) and doctors.

### User Portal

* **Secure Authentication:** User authentication is handled by **NextAuth**, which provides a secure and flexible solution. Sessions are managed through session cookies and JSON Web Tokens (JWT), guaranteeing a persistent and encrypted session that protects user data and ensures a frictionless login experience.
* **Searchable Disease Database:** An extensive, user-friendly database allows individuals to search for and explore a wide range of diseases. Each entry provides detailed information on symptoms, potential causes, and common treatment options, empowering users with reliable health information.
* **Verified Doctor Directory:** Users can browse a carefully curated list of verified doctors. The powerful filtering system allows them to narrow their search by specific medical specialties, while a clear rating system and detailed profiles enable them to make a confident and informed decision.
* **Appointment Management:** The platform offers an intuitive appointment request system. Users can select a suitable date and time from a doctor's availability, and the request is reflected immediately on both the patient and doctor portals, facilitating a transparent and efficient booking process.

### Doctor Portal

* **Profile Management:** Doctors have access to a dedicated profile where they can input and update their personal details, list their specialties, and manage their working hours and availability. This provides patients with a comprehensive view of their qualifications and services.
* **Freelance Opportunity:** CarePath empowers doctors to work as freelancers, expanding their professional reach and connecting them with a broader patient base without the constraints of a traditional clinic.
* **Verification Process:** To ensure patient safety and build a foundation of trust, all doctors undergo a rigorous verification process. They are required to upload a digital copy of their professional degree and a comprehensive profile for an administrative review before their public listing is approved.
* **Appointment Dashboard:** Doctors are provided with a clear and intuitive dashboard to view and manage all their scheduled appointments. This centralized portal helps them organize their schedule efficiently, track patient requests, and prepare for upcoming consultations.

---

## Project Structure

```
CarePath/
├── .eslintrc.json
├── .gitignore
├── README.md
├── app/
│   ├── About/
│   │   └── page.js
│   ├── Consult/
│   │   └── page.js
│   ├── Contact/
│   │   └── page.jsx
│   ├── Doctors/
│   │   ├── [id]/
│   │   │   └── page.js
│   ├── Login/
│   │   └── page.js
│   ├── Search/
│   │   └── page.js
│   ├── Signup/
│   │   └── page.js
│   ├── actions/
│   │   ├── auth.js
│   │   └── profile.js
│   ├── api/
│   │   ├── add/
│   │   │   ├── getInfo/
│   │   │   │   └── route.js
│   │   │   └── search_di/
│   │   │       └── route.js
│   │   ├── doctor/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   └── all/
│   │   │       └── route.js
│   │   └── upload/
│   │       └── route.js
│   ├── globals.css
│   ├── hooks/
│   │   ├── useDoctor.js
│   │   └── useUser.js
│   ├── layout.js
│   ├── lib/
│   │   ├── cloudinary.js
│   │   ├── definations.js
│   │   ├── supabase/
│   │   │   ├── client.js
│   │   │   └── server.js
│   │   └── user.js
│   ├── page.js
│   └── profile/
│       ├── layout.js
│       ├── page.js
│       └── settings/
│           └── page.js
│
├── components/
│   ├── care.js
│   ├── content1.js
│   ├── footer.js
│   ├── header.jsx
│   ├── homeimage.js
│   └── (other UI components…)
│
└── vercel.json
```

---

## 💻 Tech Stack

This project is built upon a modern and scalable tech stack, demonstrating an understanding of full-stack development.

### Frontend

| Technology | Description |
| :--- | :--- |
| **Next.js** | Used as the foundation for the front-end, Next.js provides server-side rendering and static site generation capabilities. This ensures optimal performance, fast page loads, and excellent SEO, which is crucial for a public-facing health platform. |
| **React.js** | The core library for building the dynamic and component-based user interface. Its declarative nature and state management capabilities make it ideal for creating interactive and complex UIs like the appointment calendar and doctor profiles. |
| **Tailwind CSS** | A utility-first CSS framework that enabled the rapid development of a custom, modern, and fully responsive user interface. Its extensive class-based system ensures a consistent look and feel across the application and simplifies the process of making it look great on all screen sizes. |

### Backend

| Technology | Description |
| :--- | :--- |
| **Supabase** | An open-source backend-as-a-service solution that provides the database, authentication, and API layer. This allowed for a streamlined development process without the need to set up a separate backend server. |
| **PostgreSQL** | The robust relational database system powering Supabase, used to store and manage all application data. Its reliability and structured nature are perfect for handling critical data like user profiles, doctor credentials, and appointment schedules. |
| **Cloudinary** | A cloud-based service for hosting and managing all image assets, such as doctor degrees and profile pictures. Cloudinary's powerful features automatically optimize images for web delivery, improving performance and reducing bandwidth usage. |

---

## 🚀 Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

* `npm` or `yarn` installed
* Node.js (LTS version recommended)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Parth-Singla-123/CarePath](https://github.com/Parth-Singla-123/CarePath)
    cd carepath
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    * Create a `.env.local` file in the root directory.
    * Add your Supabase and Cloudinary credentials. The required keys are:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=...
        NEXT_PUBLIC_SUPABASE_ANON_KEY=...
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
        NEXTAUTH_SECRET=...
        ```
    * Refer to the Supabase and Cloudinary documentation to obtain these values.
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/carepath/issues).

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 📞 Contact

**Your Name** - [parth.singla.ug23@nsut.ac.in](mailto:parth.singla.ug23@nsut.ac.in)

Project Link: [https://care-path-phi.vercel.app](https://care-path-phi.vercel.app)
