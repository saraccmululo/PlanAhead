const Footer = () => {
  const year = new Date().getFullYear(); // gets current year automatically
  return (
    <footer
      className="d-flex align-items-center justify-content-center px-3 py-2"
      style={{ backgroundColor: "#E5E7EB" }}
    >
      <h6 className="mb-0 text-center" style={{ color: '#374151' }}>
        {year} Developed by{" "}
        <span
          style={{
            fontFamily: "'Lato', sans-serif",
            fontStyle: "italic",
            color: "#1E3A8A",
          }}
        >
          Sara Costa Cabral Mululo
        </span>{" "}
        as a Final Project for Harvard CS50
      </h6>
    </footer>
  );
};

export default Footer;
