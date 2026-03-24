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
        <Link to={to} className="cssbuttons-io-button">
          {label}
          <div className="icon">
            <svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
            </svg>
          </div>
        </Link>
      </StyledWrapper>
    </motion.div>
  );
}

const StyledWrapper = styled.div`
  .cssbuttons-io-button {
    background: var(--accent);
    color: white;
    font-family: inherit;
    padding: 0.35em;
    padding-left: 1.25em;
    font-size: 15px;
    font-weight: 600;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 1.6em -0.6em var(--accent-hover);
    overflow: hidden;
    position: relative;
    height: 2.8rem;
    padding-right: 3.3em;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
  }

  .cssbuttons-io-button .icon {
    background: white;
    margin-left: 1em;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.2em;
    width: 2.2em;
    border-radius: 0.7em;
    box-shadow: 0.1em 0.1em 0.6em 0.2em rgba(0,0,0,0.1);
    right: 0.3em;
    transition: all 0.3s;
  }

  .cssbuttons-io-button:hover .icon {
    width: calc(100% - 0.6em);
  }

  .cssbuttons-io-button .icon svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: var(--accent);
  }

  .cssbuttons-io-button:hover .icon svg {
    transform: translateX(-0.1em);
  }

  .cssbuttons-io-button:active .icon {
    transform: scale(0.95);
  }`;

export default BackButton;
