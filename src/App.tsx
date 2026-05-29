import { PostList } from "./components/PostList";

function App() {
  return (
    <div className='App'>
      <header className='app-header'>
        <h1>📝 Test Boilerplate - Blog Platform</h1>
        <p>
          Test your backend API with this simple interface
        </p>
      </header>
      <main className='app-main'>
        <PostList />
      </main>
      <footer className='app-footer'>
        <p>API Endpoint: http://localhost:3000/</p>
        <p>Swagger Docs: http://localhost:3000/docs</p>
      </footer>
    </div>
  );
}

export default App;
