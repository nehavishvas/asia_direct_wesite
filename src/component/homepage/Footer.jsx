
import React, { useEffect, useState } from 'react'
import image1 from '../../assestss/logo.png'
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios'
import './Footer.css'

export default function Footer() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getdata = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}get-social-links`)
      setData(response.data.data)
    } catch (error) {
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    getdata()
  }, [])

  return (
    <footer className="premium-footer">
      {/* Main Footer Links */}
      <div className="footer-main-content">
        <div className="container">
          <div className="row">
            {/* Column 1: Brand details */}
            <div className="col-lg-5 col-md-6 mb-5 mb-lg-0">
              <div className="footer-brand-sec">
                <Link className="footer-brand-logo" to="/">
                  <img src={image1} alt="Asia Direct Logo" />
                </Link>
                <p className="footer-brand-desc">
                  Asia Direct is Southern Africa's leading Procurement & Logistics Provider for Medical, Furniture, Automotive, Agricultural & Mining sectors.
                </p>
                <div className="footer-offices-badge">
                  <span>SA</span> • <span>Botswana</span> • <span>Namibia</span> • <span>Zambia</span> • <span>Zimbabwe</span>
                </div>
                {!loading && !error && (
                  <div className="footer-social-links">
                    {data?.facebook_link && (
                      <a href={data?.facebook_link} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="fa fa-facebook" />
                      </a>
                    )}
                    {data?.linkedin_link && (
                      <a href={data?.linkedin_link} target="_blank" rel="noopener noreferrer" aria-label="Skype">
                        <i className="fa fa-skype" />
                      </a>
                    )}
                    {data?.twitter_link && (
                      <a href={data?.twitter_link} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <i className="fa fa-twitter" />
                      </a>
                    )}
                    {data?.instagram_link && (
                      <a href={data?.instagram_link} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fa fa-instagram" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Categories */}
            <div className="col-lg-3 col-md-6 mb-5 mb-lg-0 offset-lg-1">
              <div className="footer-links-column">
                <h4>Categories</h4>
                <ul>
                  <li><NavLink to="/shippingmode">Shipping</NavLink></li>
                  <li><NavLink to="/dispute">Dispute</NavLink></li>
                  <li><NavLink to="/customClear">Customs Clearing</NavLink></li>
                  <li><NavLink to="/warehouse">Warehousing</NavLink></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Contact info */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-links-column contact-info-col">
                <h4>Contact Details</h4>
                <p><i className="fa fa-envelope" /> info@asiadirect.com</p>
                <p><i className="fa fa-phone" /> +27 (0) 11 123 4567</p>
                <p><i className="fa fa-map-marker" /> Johannesburg, South Africa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom copyright bar */}
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p>© 2026 Asia Direct. All rights reserved. Powered by webnmobapps solution.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-legal-links">
                <Link to="/Terms-condition">Terms & Conditions</Link>
                <Link to="/Privacy-policy">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
