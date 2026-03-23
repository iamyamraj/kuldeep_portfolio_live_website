import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Database Developer</h4>
                <h5>Kurukshetra Institute of Professional Studies</h5>
              </div>
              <h3>2018-2021</h3>
            </div>
            <p>
              Enhanced data management and decision-making processes through expert database administration and development. Created and optimized SSRS reports, designed interactive PowerBI dashboards.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Delivery Vans Supervisor</h4>
                <h5>SP Manpower Inc.</h5>
              </div>
              <h3>2023-2024</h3>
            </div>
            <p>
              Oversaw fleet operations, ensured efficient delivery schedules, and maintained high-performance logistics. Streamlined last-mile delivery services using route optimization and driver coordination.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Teaching Assistant</h4>
                <h5>R.S. Modern Public School</h5>
              </div>
              <h3>2024-NOW</h3>
            </div>
            <p>
              Providing virtual academic support, student engagement, and classroom assistance in online learning environments. Expertise in e-learning tools, individualized instruction, and digital classroom management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
