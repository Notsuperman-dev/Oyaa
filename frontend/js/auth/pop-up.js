// Function to show the pop-up
function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('popupOverlay');
    
    if (popup && overlay) {
        popup.classList.add('active');
        overlay.classList.add('active');
        
        // Attach the event listener for closing the popup
        const closeButton = popup.querySelector('.close-btn');
        if (closeButton) {
            closeButton.addEventListener('click', closePopup);
        }
    }
}

// Function to close the pop-up
function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.remove('active');
    });
    document.getElementById('popupOverlay').classList.remove('active');
}

// Add event listeners for the footer links
document.getElementById('privacyPolicyLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('privacyPolicyPopup').innerHTML = `
        <div class="popup-content">
            <h2>Privacy Policy</h2>
            <p>At Oyaa, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy outlines how we collect, use, store, and share your data when you use our web app, ensuring transparency and giving you control over your information.</p>
            <h3>Information We Collect</h3>
            <p><strong>Personal Information:</strong> When you sign up, we collect your username and password. This information is securely stored and used solely for account management and authentication purposes.</p>
            <p><strong>Usage Data:</strong> We may collect information about how you interact with the app, such as pages visited, actions taken, and other usage data to enhance your experience.</p>
            <p><strong>Cookies:</strong> We use cookies to improve your browsing experience, maintain session information, and enable certain features like remembering your preferences.</p>
            <h3>How We Use Your Information</h3>
            <p><strong>Account Management:</strong> We use your personal information to manage your account, authenticate your identity, and ensure secure access to the app.</p>
            <p><strong>Enhancing User Experience:</strong> Your usage data helps us improve the functionality and features of the app.</p>
            <p><strong>Security:</strong> We use your data to monitor for suspicious activity and protect the integrity of our platform.</p>
            <h3>Sharing Your Information</h3>
            <p>We do not share, sell, or rent your personal information to third parties. However, we may share your data under the following circumstances:</p>
            <p><strong>Legal Compliance:</strong> If required by law, we may share your information with government authorities or other entities.</p>
            <p><strong>Service Providers:</strong> We may share your data with trusted service providers who assist us in operating the app, provided they adhere to our privacy standards.</p>
            <h3>Data Security</h3>
            <p>We implement robust security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>
            <h3>Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
                <li>Access Your Data: Request a copy of the personal information we hold about you.</li>
                <li>Delete Your Data: Request the deletion of your personal information.</li>
                <li>Update Your Information: Update your account information through the settings page.</li>
            </ul>
            <h3>Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.</p>
            <h3>Contact Us</h3>
            <p>If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:supermanonipad@gmail.com">supermanonipad@gmail.com</a> or 07049697710.</p>
            <button class="close-btn">Close</button>
        </div>
    `;
    showPopup('privacyPolicyPopup');
});

document.getElementById('termsOfServiceLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('termsOfServicePopup').innerHTML = `
        <div class="popup-content">
            <h2>Terms of Service</h2>
            <p>Welcome to Oyaa! These Terms of Service govern your use of our web app. By accessing or using Oyaa, you agree to these terms. Please read them carefully.</p>
            <h3>Acceptance of Terms</h3>
            <p>By using Oyaa, you agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the app.</p>
            <h3>User Accounts</h3>
            <p><strong>Eligibility:</strong> You must be at least 13 years old to create an account and use Oyaa.</p>
            <p><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your username and password and for all activities that occur under your account.</p>
            <p><strong>Account Termination:</strong> We reserve the right to terminate or suspend your account if you violate these terms or engage in any activity that harms the app or other users.</p>
            <h3>User Conduct</h3>
            <p><strong>Prohibited Activities:</strong> You agree not to use Oyaa for any unlawful or harmful activities, including but not limited to harassment, spamming, or distributing malicious software.</p>
            <p><strong>Content Ownership:</strong> You retain ownership of any content you post, but you grant Oyaa a non-exclusive, royalty-free license to use, display, and distribute your content within the app.</p>
            <p><strong>Content Moderation:</strong> We reserve the right to remove or edit content that violates these terms or is deemed inappropriate.</p>
            <h3>Intellectual Property</h3>
            <p>All content, features, and functionality of Oyaa, including text, graphics, logos, and software, are the exclusive property of Oyaa or its licensors and are protected by copyright, trademark, and other intellectual property laws.</p>
            <h3>Limitation of Liability</h3>
            <p>Oyaa is provided "as is" without any warranties of any kind. We do not guarantee that the app will be error-free, secure, or uninterrupted. In no event shall Oyaa be liable for any damages arising from your use of the app.</p>
            <h3>Changes to the Terms</h3>
            <p>We may update these Terms of Service from time to time. Any changes will be posted on this page, and your continued use of the app constitutes acceptance of the revised terms.</p>
            <h3>Contact Us</h3>
            <p>If you have any questions or concerns about these Terms of Service, please contact us at <a href="mailto:supermanonipad@gmail.com">supermanonipad@gmail.com</a> or 07049697710.</p>
            <button class="close-btn">Close</button>
        </div>
    `;
    showPopup('termsOfServicePopup');
});

document.getElementById('contactUsLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('contactUsPopup').innerHTML = `
        <div class="popup-content">
            <h2>Contact Us</h2>
            <p>We value your feedback and are here to assist you with any questions or concerns you may have about Oyaa. Please feel free to reach out to us through any of the following methods:</p>
            <p>Email: <a href="mailto:supermanonipad@gmail.com">supermanonipad@gmail.com</a></p>
            <p>Phone: 07049697710</p>
            <p>WhatsApp: 07049697710</p>
            <h3>Business Hours:</h3>
            <p>Monday to Friday: 9:00 AM - 5:00 PM West African Time</p>
            <p>Saturday: 10:00 AM - 2:00 PM West African Time</p>
            <p>We aim to respond to all inquiries within 24-48 hours. Thank you for using Oyaa!</p>
            <button class="close-btn">Close</button>
        </div>
    `;
    showPopup('contactUsPopup');
});

document.getElementById('popupOverlay')?.addEventListener('click', closePopup);
