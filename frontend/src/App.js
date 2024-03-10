import './App.scss';
import AppRouter from './routes/AppRoutes';
import Header from './layouts/Header/Header';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './layouts/Footer/Footer';

function App() {
  return (
    <>
      <div className='App'>
        <Header/>
        <Navbar/>
        <div className='site-content'>
          <AppRouter/>
        </div>
        <Footer/>
      </div>
    </>
  );
}

export default App;
