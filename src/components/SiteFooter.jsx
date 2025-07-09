import React from "react";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="footer no-select">
      &copy; {new Date().getFullYear()}{" "}
      <a
        href="https://github.com/LilyLavender"
        target="_blank"
        rel="noopener noreferrer"
      >
        LilyLambda
      </a>
    </footer>
  );
}