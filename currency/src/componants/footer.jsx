import React from "react";

const footerStyle = {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    background: "gray",
    color: "#fff",
    textAlign: "center",
    padding: "1rem 0",
    letterSpacing: "1px",
    animation: "slideUp 1s ease",
    zIndex: 100,
};

const keyframes = `
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`;

function Footer() {
    return (
        <>
            <style>{keyframes}</style>
            <footer style={footerStyle}>
                &copy; {new Date().getFullYear()} Currency App. All rights reserved.
            </footer>
        </>
    );
}

export default Footer;