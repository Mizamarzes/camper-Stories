import React, { useEffect, useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Edit } from 'lucide-react';
import { endpoints } from '@/services/apiConfig';
import { updateCamperProfile } from '@/services/camperService';

const ProfileHeaderModal = ({ initialData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ciudadesColombia, setCiudadesColombia] = useState([]);
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    city: initialData?.city || '',
    age: initialData?.age || '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { 
    const fetchCities = async () => {
      try {
        const response = await fetch(endpoints.city);
        const text = await response.text(); // Obtener la respuesta como texto
        console.log("Respuesta de la API:", text); // Para depuración

        // Verificar si la respuesta es JSON
        const contentType = response.headers.get("content-type");
        if (
          response.ok &&
          contentType &&
          contentType.includes("application/json")
        ) {
          const data = JSON.parse(text); // Convertir a JSON
          console.log("Ciudades obtenidas:", data);
          setCiudadesColombia(data.data); // Accediendo a la propiedad 'data'
        } else {
          console.error(
            "Error: La respuesta no es un JSON válido o hubo un problema con la solicitud."
          );
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    fetchCities();
  }, []);
  
  useEffect(() => {
    const navbar = document.querySelector('.navbar-profile');
    if (navbar) {
      navbar.classList.toggle('navbar-hidden', isOpen);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        imageUrl: imageUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedData = {
        full_name: formData.nombre,
        city: formData.city,
        age: formData.age,
        profile_picture: formData.profilePicture,
      };

      // Aquí llamamos al servicio para actualizar el perfil
      const updatedProfile = await updateCamperProfile(initialData.id, updatedData);

      console.log("Perfil actualizado exitosamente:", updatedProfile);
      setIsOpen(false); // Cierra el modal tras la actualización
    } catch (err) {
      setError("No se pudo actualizar el perfil. Por favor, inténtalo nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghostNoHover" size="icon">
          <Edit className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto z-[9999] bg-white text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 ">Foto de Perfil</label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input
              name="nombre"
              className="text-gray-900 bg-gray-50"
              value={formData.nombre}
              onChange={handleChange}
              maxLength={35} // Añade esta prop para limitar también desde HTML
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Ciudad</label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData(prev => ({...prev, city: value}))}
            >
              <SelectTrigger className="w-full text-gray-900 bg-gray-50">
                <SelectValue placeholder="Selecciona una ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[9999] text-gray-900">
                {ciudadesColombia.map((city) => (
                  <SelectItem 
                    key={city.id} 
                    value={city.id}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogTrigger asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogTrigger>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileHeaderModal;