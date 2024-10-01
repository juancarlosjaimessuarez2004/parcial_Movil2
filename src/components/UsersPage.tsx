import axios from "axios";
import { useEffect, useState } from "react";
import './style.css'; // Importa tu archivo CSS aquí

// Define la interfaz para los datos que esperas recibir
interface SWAPIResponse {
  uid: string;
  name: string;
  url: string;
}

interface SWAPIDetailResponse {
  properties: {
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
  };
}

// Mapeo de nombres a URLs de imágenes de los personajes
const characterImages: { [key: string]: string } = {
  "Luke Skywalker": "https://starwars-visualguide.com/assets/img/characters/1.jpg",
  "Darth Vader": "https://starwars-visualguide.com/assets/img/characters/4.jpg",
  "Leia Organa": "https://starwars-visualguide.com/assets/img/characters/5.jpg",
  "Obi-Wan Kenobi": "https://starwars-visualguide.com/assets/img/characters/10.jpg",
  // Agrega más personajes con sus imágenes aquí...
};

// Función para cargar los usuarios
const loadUsers = async (): Promise<SWAPIResponse[]> => {
  try {
    const { data } = await axios.get<{ results: SWAPIResponse[] }>('https://www.swapi.tech/api/people');
    return data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Función para cargar los detalles de un usuario
const loadUserDetails = async (uid: string): Promise<SWAPIDetailResponse> => {
  try {
    const { data } = await axios.get<SWAPIDetailResponse>(`https://www.swapi.tech/api/people/${uid}`);
    return data.result;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

const UsersPage = () => {
  const [users, setUsers] = useState<SWAPIResponse[]>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<SWAPIDetailResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);  // Índice del usuario actual
  const [loading, setLoading] = useState(false);  // Para manejar el estado de carga

  useEffect(() => {
    loadUsers().then(users => {
      setUsers(users);
      if (users.length > 0) {
        handleMoreInfoClick(users[0].uid);  // Cargar detalles del primer usuario
      }
    });
  }, []);

  // Función para manejar el clic en "Más información"
  const handleMoreInfoClick = (uid: string) => {
    setLoading(true);  // Empieza a cargar
    loadUserDetails(uid)
      .then(details => setSelectedUserDetails(details))
      .finally(() => setLoading(false));  // Termina de cargar
  };

  // Función para ir al siguiente usuario
  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      handleMoreInfoClick(users[newIndex].uid);  // Cargar detalles del nuevo usuario
    }
  };

  // Función para ir al usuario anterior
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      handleMoreInfoClick(users[newIndex].uid);  // Cargar detalles del nuevo usuario
    }
  };

  return (
    <div>
      {/* Mostrar estado de carga */}
      {loading && <p>Cargando detalles...</p>}

      {/* Mostrar el personaje actual */}
      {users.length > 0 && !loading && (
        <div>
          <h2>{users[currentIndex].name}</h2>
          <img
            src={characterImages[users[currentIndex].name] || 'https://via.placeholder.com/100'} 
            alt="user avatar"
          />
          {selectedUserDetails && (
            <div>
              <h3>Detalles del usuario</h3>
              <p><strong>Altura:</strong> {selectedUserDetails.properties.height} cm</p>
              <p><strong>Peso:</strong> {selectedUserDetails.properties.mass} kg</p>
              <p><strong>Color de cabello:</strong> {selectedUserDetails.properties.hair_color}</p>
              <p><strong>Color de piel:</strong> {selectedUserDetails.properties.skin_color}</p>
              <p><strong>Color de ojos:</strong> {selectedUserDetails.properties.eye_color}</p>
              <p><strong>Año de nacimiento:</strong> {selectedUserDetails.properties.birth_year}</p>
              <p><strong>Género:</strong> {selectedUserDetails.properties.gender}</p>
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      <div>
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          Anterior
        </button>
        <button onClick={handleNext} disabled={currentIndex === users.length - 1}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
