"use client";

import React from "react";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Footer from "../components/Footer";

const CookiePolicy = () => {
    const router = useRouter();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Wrapper>
                <div className="cookie-policy-container">
                    <div className="bc-wrapper">
                        <nav className="breadcrumb">
                            <span className="bc-link" onClick={() => router.push("/")}>
                                Website
                            </span>
                            <span className="bc-separate"> <FiArrowRight /> </span>
                            <span className="bc-link" onClick={() => router.push("/")}>
                                Home
                            </span>
                            <span className="bc-separate"> <FiArrowRight /> </span>
                            <span className="bc-current">Cookie Policy</span>
                        </nav>
                        <h1 className="cookie-policy-heading">Cookie Policy</h1>
                    </div>
                    <div className="top-bar">
                        <button
                            className="back-button"
                            onClick={() => router.back()}
                        >
                            <FiArrowLeft color="black" />
                        </button>
                        <h1 className="cookie-policy-title">Cookie Policy</h1>
                    </div>
                    <div className="divider"></div>
                    <div className="content">
                        <section>
                            <p>Last Updated Date : 08/01/2026 12:00 PM</p>
                            <h2>1. Introduction</h2>
                            <p>
                                This Cookie Policy explains how <strong>ListedIndia</strong>, operated by 
                                <strong> Bold India Platforms Private Limited</strong>, uses cookies and similar 
                                tracking technologies on our website and mobile applications. By using our services, 
                                you consent to the use of cookies as described in this policy.
                            </p>
                        </section>

                        <section>
                            <h2>2. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) 
                                when you visit a website. They help websites remember your preferences, improve user experience, 
                                and provide analytics about how the site is used.
                            </p>
                            <p>
                                Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" 
                                (remain on your device until they expire or you delete them).
                            </p>
                        </section>

                        <section>
                            <h2>3. Types of Cookies We Use</h2>
                            <p>We use the following types of cookies on our platform:</p>
                            <ul>
                                <li>
                                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to 
                                    function properly. They enable core features like security, authentication, and session 
                                    management. Without these cookies, certain services cannot be provided.
                                </li>
                                <li>
                                    <strong>Performance & Analytics Cookies:</strong> These cookies collect information 
                                    about how visitors use our website, such as which pages are visited most often and if 
                                    users receive error messages. This data helps us improve website performance and user experience.
                                </li>
                                <li>
                                    <strong>Functionality Cookies:</strong> These cookies remember your choices and 
                                    preferences (such as language, region, or login information) to provide enhanced, 
                                    personalized features.
                                </li>
                                <li>
                                    <strong>Advertising & Targeting Cookies:</strong> These cookies are used to deliver 
                                    relevant advertisements and track ad campaign effectiveness. They may also limit the 
                                    number of times you see an advertisement.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Third-Party Cookies</h2>
                            <p>
                                We may use third-party service providers who set cookies on our behalf to perform 
                                analytics, advertising, and other services. These third parties include:
                            </p>
                            <ul>
                                <li>Google Analytics (for website analytics)</li>
                                <li>Facebook Pixel (for advertising and remarketing)</li>
                                <li>LinkedIn Insight Tag (for professional networking analytics)</li>
                                <li>Other trusted partners for performance monitoring and security</li>
                            </ul>
                            <p>
                                These third-party cookies are governed by the respective privacy policies of these providers.
                            </p>
                        </section>

                        <section>
                            <h2>5. How We Use Cookies</h2>
                            <p>Cookies help us to:</p>
                            <ul>
                                <li>Authenticate users and maintain secure sessions</li>
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website traffic and user behavior</li>
                                <li>Improve platform functionality and user experience</li>
                                <li>Deliver personalized content and job recommendations</li>
                                <li>Show relevant advertisements based on your interests</li>
                                <li>Prevent fraud and ensure platform security</li>
                            </ul>
                        </section>

                        <section>
                            <h2>6. Managing Cookies</h2>
                            <p>
                                You have the right to accept or reject cookies. Most web browsers automatically accept 
                                cookies, but you can modify your browser settings to decline cookies if you prefer.
                            </p>
                            <p>To manage cookies, you can:</p>
                            <ul>
                                <li>Adjust your browser settings to block or delete cookies</li>
                                <li>Use browser privacy or incognito mode</li>
                                <li>Opt out of third-party advertising cookies through industry opt-out tools</li>
                                <li>Disable cookies in your device settings for mobile applications</li>
                            </ul>
                            <p>
                                <strong>Note:</strong> Disabling cookies may affect the functionality of our website 
                                and limit your access to certain features.
                            </p>
                        </section>

                        <section>
                            <h2>7. Cookie Retention Period</h2>
                            <p>
                                The retention period for cookies varies based on their type:
                            </p>
                            <ul>
                                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (ranging from days to years) unless manually deleted</li>
                            </ul>
                        </section>

                        <section>
                            <h2>8. Updates to This Cookie Policy</h2>
                            <p>
                                We may update this Cookie Policy from time to time to reflect changes in technology, 
                                legal requirements, or our business practices. Any updates will be posted on this page 
                                with a revised "Last Updated" date.
                            </p>
                        </section>

                        <section>
                            <h2>9. Contact Information</h2>
                            <p>
                                If you have any questions or concerns about our use of cookies, please contact us:
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

    .cookie-policy-container {
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
        .cookie-policy-title
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
        .cookie-policy-heading{
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

    .cookie-policy-title {
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

export default CookiePolicy;