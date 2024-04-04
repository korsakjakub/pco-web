const NotFound = () => {
  return (
    <main className="container" >
      <header>
        <h1><a href="/">jetons</a></h1>
      </header>
      <div>
        <h2>404 you got lost, friend</h2>
      </div>
      <footer>
        <nav>
          <ul>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/assets">Assets</a></li>
          </ul>
        </nav>
      </footer>
    </main>
  );
};

export default NotFound;
