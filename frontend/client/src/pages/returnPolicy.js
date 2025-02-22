import React from "react";
import "./return.css"; // Optional: Add styling for better UI

const ReturnPolicy = () => {
  return (
    <div className="return-policy-container">
      <h1>Return Policy</h1>
      <p>
        At <strong>Bazelink</strong>, we strive to ensure customer satisfaction with every purchase. If you
        are not completely satisfied with your order, we are here to help.
      </p>

      <h2>1. Eligibility for Returns</h2>
      <ul>
        <li>Items must be returned within <strong>7 days</strong> of delivery.</li>
        <li>The item must be <strong>unused, in its original packaging</strong>, and in the same condition as received.</li>
        <li>Certain items, such as <strong>perishable goods, custom-made products, and digital downloads</strong>, are non-returnable unless defective.</li>
      </ul>

      <h2>2. Return Conditions</h2>
      <p>
        When returning an item for any reason, you must do so in the exact condition you received it from <strong>Bazelink</strong>, with its original packaging and all tags and labels attached (e.g., shoes should be returned within the original shoe box; and seals on items including audio or video recordings or software must not be removed). 
      </p>
      <p>
        Returned items are your responsibility until they reach us, so ensure they are packaged properly to prevent damage during transit. You must not include any items in the packaging that were not part of the original order. Additionally, you must delete all personal data and deactivate any accounts linked to the returned item. <strong>Bazelink</strong> will not be responsible for any items erroneously included in a returned package or for any data breaches resulting from failure to eliminate personal data.
      </p>

      <h2>3. Reasons for Return</h2>
      <table className="return-table">
        <thead>
          <tr>
            <th>Reason for Return</th>
            <th>Applicable Product Categories</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>I changed my mind</td>
            <td>
              All product categories except:
              <ul>
                <li>Perishable goods</li>
                <li>Custom-made products</li>
                <li>Digital downloads</li>
                <li>Underwear, Swimwear, and Lingerie</li>
                <li>Health & Wellness products</li>
                <li>Software and Electronics (unless seal is intact)</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Size is correct but doesn't fit as expected</td>
            <td>Clothing and Shoes only</td>
          </tr>
          <tr>
            <td>Item received broken or defective</td>
            <td>All product categories</td>
          </tr>
          <tr>
            <td>Packaging was damaged</td>
            <td>All product categories</td>
          </tr>
          <tr>
            <td>Item received with missing parts or accessories</td>
            <td>All product categories</td>
          </tr>
          <tr>
            <td>Item received used or expired</td>
            <td>All product categories except software</td>
          </tr>
          <tr>
            <td>Item seems to be fake / unauthentic</td>
            <td>All product categories</td>
          </tr>
          <tr>
            <td>Wrong item / color / size / model</td>
            <td>All product categories</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Return Process</h2>
      <ol>
        <li>
          <strong>Initiate a Return</strong>
          <ul>
            <li>Contact our support team at <a href="mailto:bazelink.ltd@gmail.com">bazelink.ltd@gmail.com</a> or log into your account to request a return.</li>
            <li>Provide your <strong>order number</strong> and a reason for the return.</li>
            <li>We offer free returns for your packages in two easy ways:
              <ol>
                <li>Return drop-off at a pickup station nearest to you.</li>
                <li>Return pick-up (only applicable for Nairobi & its metropolitan areas).</li>
              </ol>
            </li>
          </ul>
        </li>
        <li>
          <strong>Approval & Shipping</strong>
          <ul>
            <li>Once your return request is approved, we will provide the return shipping address.</li>
            <li>You are responsible for <strong>return shipping costs</strong>, unless the return is due to a defective or incorrect item.</li>
          </ul>
        </li>
      </ol>

      <h2>5. Exceptions</h2>
      <ul>
        <li><strong>Sale items</strong> are final and cannot be returned.</li>
        <li><strong>Gift cards</strong> and <strong>downloadable products</strong> are non-refundable.</li>
      </ul>

      <h2>7. Rejected Return and Refund Requests and Forfeiture</h2>
      <p>
        All items are inspected on return to verify the return reasons provided. If your return request is not approved by <strong>Bazelink</strong>, you shall not receive any refund of the purchase price or the delivery fees, and we will make 2 attempts to redeliver within 6 business days. If both re-delivery attempts are unsuccessful, we will immediately notify you that we will hold the item for a further 30 days from the date of the initial notification. Our notification will include details about pick-up location and opening hours. If you do not collect the item within the required period, you shall forfeit the item, i.e., the item shall become <strong>Bazelink</strong> property, and <strong>Bazelink</strong> may dispose of it in any manner that it determines appropriate, e.g., by sale, charitable donation, recycling, or destruction.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        For any questions or concerns, please reach out to us at <a href="mailto: bazelink.ltd@gmail.com">bazelink.ltd@gmail.com</a> or call <strong>[customer service number]</strong>.
      </p>
    </div>
  );
};

export default ReturnPolicy;

