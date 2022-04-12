import './App.css';
import Search from './Components/Search/Search'; 
import SongDetail from './Components/SongDetail/SongDetail';
import AlbumDetail from './Components/AlbumDetail/AlbumDetail';
import ArtistDetail from './Components/ArtistDetail/ArtistDetail';
import HowToUse from './Components/HowToUse/HowToUse';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Container, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/" style={{fontSize: "30px"}}>Lyri.CS</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/use">How to Use</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
        <ScrollToTop>
          <Routes>
            <Route path='/' element={<Search/>}/>
            <Route path='/song/:id' element={<SongDetail/>}/>
            <Route path='/album/:id' element={<AlbumDetail/>}/>
            <Route path='/artist/:id' element={<ArtistDetail/>}/>
            <Route path='/use' element={<HowToUse/>}/>
          </Routes>
        </ScrollToTop>
    </Router>
  );
}

export default App;
