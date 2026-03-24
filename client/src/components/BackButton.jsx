import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BackButton = ({ to = "/dashboard", label = "Back to Dashboard" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="back-button-container"
    >
      <StyledWrapper>
        <Link to={to} className="button">
          <svg className="icon" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotate(180deg)' }}>
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
          </svg>
          {label}
        </Link>
      </StyledWrapper>
    </motion.div>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    padding-block: 0.4rem;
    padding-inline: 1rem;
    background-color: var(--accent);
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    gap: 8px;
    font-weight: 700;
    border: 2.5px solid rgba(255, 255, 255, 0.2);
    outline: none;
    overflow: hidden;
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
  }

  .icon {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease-in-out;
  }

  .button:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.5);
    background-color: var(--accent-hover);
    box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.15);
  }

  .button:hover .icon {
    transform: rotate(180deg) translate(4px);
  }

  .button:hover::before {
    animation: shine 1.5s ease-out infinite;
  }

  .button::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0) 70%
    );
    top: 0;
    left: -100px;
    opacity: 0.6;
  }

  @keyframes shine {
    0% {
      left: -100px;
    }
    60% {
      left: 100%;
    }
    to {
      left: 100%;
    }
  }`;

export default BackButton;
