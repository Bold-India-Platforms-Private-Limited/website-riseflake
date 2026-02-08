"use client";

import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    const router = useRouter();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
      <>
        <Wrapper>
                <div className="privacy-policy-container">
                    <div className="bc-wrapper">
                        <nav className="breadcrumb">
                            <span className='bc-link' onClick={() => router.push("/")}>
                                Website
                            </span>
                            <span className='bc-separate'> <FiArrowRight /> </span>
                            <span className='bc-link' onClick={() => router.push("/")}>
                                Home
                            </span>
                             <span className='bc-separate'> <FiArrowRight /> </span>
                            <span className='bc-current'>Privacy Policy</span>

                        </nav>
                        <h1 className='privacy-policy-heading'>Privacy Policy</h1>
                    </div>
                    <div className="top-bar">
                        <button
                            className="back-button"
                            onClick={() => router.back()}
                        >
                            <FiArrowLeft color="black" />
                        </button>
                        <h1 className="privacy-policy-title">Privacy Policy</h1>
                    </div>
                    <div className="divider"></div>
                    <div className="content">
    <section>
        <p>Last Updated Date : 08/01/2026 12:00 PM</p>
        <h2>1. Introduction</h2>
        <p>
            Welcome to <strong>ListedIndia</strong>, a digital employment and professional networking
            platform operated by <strong>Bold India Platforms Private Limited</strong>.
            We provide services through our website and mobile applications available on the
            Google Play Store and Apple App Store.
        </p>
        <p>
            This Privacy Policy explains how we collect, use, store, disclose, and protect
            your personal data in compliance with applicable Indian laws, including the
            Information Technology Act, 2000, Digital Personal Data Protection Act, 2023,
            and globally accepted data protection standards.
        </p>
    </section>

    <section>
        <h2>2. Information We Collect</h2>
        <p>We collect information in the following categories:</p>
        <ul>
            <li>
                <strong>Personal Information:</strong> Name, email address, phone number,
                date of birth, profile photo, resume details, education, employment history,
                and professional skills.
            </li>
            <li>
                <strong>Account Information:</strong> Login credentials, preferences,
                communication settings, and verification data.
            </li>
            <li>
                <strong>Usage & Technical Data:</strong> Device information, IP address,
                browser type, operating system, app usage data, cookies, and log files.
            </li>
            <li>
                <strong>Recruiter & Employer Data:</strong> Company details, job postings,
                business contact information, and hiring activity.
            </li>
        </ul>
    </section>

    <section>
        <h2>3. How We Use Your Information</h2>
        <p>Your information is used to:</p>
        <ul>
            <li>Create and manage user accounts</li>
            <li>Enable job discovery, professional networking, and recruitment services</li>
            <li>Facilitate communication between job seekers, recruiters, and employers</li>
            <li>Improve platform performance, features, and user experience</li>
            <li>Send service updates, alerts, and relevant notifications</li>
            <li>Ensure platform security, fraud prevention, and legal compliance</li>
        </ul>
    </section>

    <section>
        <h2>4. Information Sharing & Disclosure</h2>
        <p>
            We do <strong>not sell</strong> personal data. Information may be shared only in the
            following circumstances:
        </p>
        <ul>
            <li>With recruiters or employers when users apply for jobs or enable profile visibility</li>
            <li>With trusted service providers under strict confidentiality agreements</li>
            <li>To comply with legal obligations, court orders, or government requests</li>
            <li>During corporate restructuring, mergers, or acquisitions (with safeguards)</li>
        </ul>
    </section>

    <section>
        <h2>5. Data Security</h2>
        <p>
            We implement industry-standard administrative, technical, and physical safeguards
            to protect your data against unauthorized access, alteration, disclosure, or destruction.
            While we strive to protect your information, no digital platform can guarantee
            absolute security.
        </p>
    </section>

    <section>
        <h2>6. Data Retention</h2>
        <p>
            Personal data is retained only for as long as necessary to fulfill the purposes
            outlined in this policy or as required under applicable laws. Users may request
            deletion of their data subject to legal and regulatory requirements.
        </p>
    </section>

    <section>
        <h2>7. Your Rights</h2>
        <p>Depending on applicable law, you have the right to:</p>
        <ul>
            <li>Access and review your personal data</li>
            <li>Correct or update inaccurate information</li>
            <li>Withdraw consent where applicable</li>
            <li>Request deletion or restriction of processing</li>
            <li>Control profile visibility and communication preferences</li>
        </ul>
    </section>

    <section>
        <h2>8. Cookies & Tracking Technologies</h2>
        <p>
            We use cookies and similar technologies to enhance user experience, analyze usage,
            and improve platform functionality. You may control cookies through browser or
            device settings.
        </p>
    </section>

    <section>
        <h2>9. Children’s Privacy</h2>
        <p>
            ListedIndia is not intended for users under the age of 18. We do not knowingly
            collect personal data from minors.
        </p>
    </section>

    <section>
        <h2>10. Changes to This Privacy Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Updates will be posted on
            this page, and continued use of our services constitutes acceptance of the revised policy.
        </p>
    </section>

    <section>
        <h2>11. Contact Information</h2>
        <p>
            If you have any questions, concerns, or data-related requests, please contact us:
        </p>
        <p>
            <strong>Company:</strong> Bold India Platforms Private Limited<br />
            <strong>Brand:</strong> ListedIndia<br />
            <strong>Email:</strong> hello@boldindia.in, support@listedindia.com<br />
            <strong>CIN:</strong> U85499PN2025PTC246360
        </p>
    </section>
</div>

            </div>
        </Wrapper>
        <Footer />
        </>
    );
};

const Wrapper = styled.section`
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    .privacy-policy-container {
        background: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
     .bc-wrapper{
       display:none;
       width: 100vw;
       background-color: #f4f4ffff;
       padding: 0.75rem 0;
       }   

    @media (min-width: 768px) {
        .top-bar {
            display: none;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem 2rem;
            background: #fff;
        }
        .privacy-policy-title
        {
        display:none;
        }
        .back-button{
        display:none;
        }
       .divider {
       display:none;
       }
       .bc-wrapper{
       display: block;
       } 
       .breadcrumb{
       display: flex;
       justify-content: flex-start;
       align-items:center;
       gap: 0.4rem;
       font-size: 0.9rem;
       color: #000000ff;
       margin-top: 1.5rem;
       padding-left: 2rem;
       max-width: 1200px;
       } 
    }
       
        
        .bc-link{
        cursor:pointer;
        font-weight:500;
    color: rgb(0, 30, 101);
  

        }
        .bc-separate
        {
        color: #000000ff;
        }  
        .bc-current{
        font-weight:500;
        color: #0165e9ff; 
        }
        .privacy-policy-heading{
        font-size: 2.4rem;
        font-weight:600;
        margin: 0.75rem 0 1.5rem;
         padding-left: 2rem;
         
        }

    .divider {
        height: 1px;
        background: #e2e8f0;
        width: 100%;
        margin: 0;
    }

    .back-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #3b82f6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s;
        margin-left: -10px;

        &:hover {
            background: #f1f5f9;
        }
    }

    .privacy-policy-title {
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
        margin-left: -15px;
    }

    .content {
        flex: 1;
        padding: 1.5rem 2rem;
        color: #64748b;
        line-height: 1.6;

        section {
            margin-bottom: 2rem;

            h2 {
                color: #334155;
                font-size: 1.2rem;
                margin-bottom: 0.75rem;
            }

            p {
                margin-bottom: 0.5rem;
            }
        }
    }

        @media (min-width: 768px) {
        height: fit-content;
        .content {
            bottom: 60px;
        }
    }
   
    @media (max-width: 768px) {
        height: 100vh;
        .top-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            margin-left: -15px;
            height: 50px;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .content {
            padding: 1rem 1.5rem;
            overflow-y: auto;
            section {
                margin-bottom: 1.5rem;
            }
        }
        
       
         }
`;

export default PrivacyPolicy;