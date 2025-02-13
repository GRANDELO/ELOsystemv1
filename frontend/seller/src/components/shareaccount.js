import React, { useState } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

import './styles/ShareAccountSection.css'; // For styling

const ShareAccountSection = ({ username }) => {
  // The link you want to share
  const shareUrl = `https://www.bazelink.co.ke/shop?businessname=${username}`;
  const shareTitle = `Check out my shop on Bazelink!`;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="share-account-section">
      <h2>Share Your Account</h2>
      <p>
        Here is a link to Your shop: 
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          {shareUrl}
        </a>
      </p>
      <button onClick={handleOpenModal} className="share-btn">
        Share
      </button>

      {isOpen && (
        <div className="share-modal-overlay" onClick={handleCloseModal}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share in your socials</h3>

            <div className="share-buttons">
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>

              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>

              <TelegramShareButton url={shareUrl} title={shareTitle}>
                <TelegramIcon size={40} round />
              </TelegramShareButton>

              <EmailShareButton url={shareUrl} subject={shareTitle}>
                <EmailIcon size={40} round />
              </EmailShareButton>
            </div>

            <div className="share-copy-section">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-link-input"
              />
              <button onClick={handleCopyLink} className="copy-btn">
                Copy
              </button>
            </div>

            <button onClick={handleCloseModal} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareAccountSection;
