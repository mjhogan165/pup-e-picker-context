import React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { deleteDogFromDb } from "../fetch/delete-dog-from-db";
import { updateFavoriteForDog } from "../fetch/update-favorite";
import { addDogToDb } from "../fetch/add-dog";

const DogContext = createContext();

function DogProvider({ children }) {
  const [showComponent, setShowComponent] = useState("all-dogs");
  const [dogs, setDogs] = useState([]);

  const refetchDogs = () => {
    fetch("http://localhost:3000/dogs")
      .then((response) => response.json())
      .then(setDogs);
  };

  const addDog = (dog) => {
    addDogToDb({
      name: dog.name,
      description: dog.description,
      image: dog.image,
    }).then(() => {
      refetchDogs();
    });
  };

  const deleteDog = (dogId) => {
    deleteDogFromDb(dogId).then(() => refetchDogs());
  };

  const unfavoriteDog = (dogId) => {
    updateFavoriteForDog({ dogId, isFavorite: false }).then(() =>
      refetchDogs()
    );
  };

  const favoriteDog = (dogId) => {
    updateFavoriteForDog({ dogId, isFavorite: true }).then(() => refetchDogs());
  };

  const unfavorited = dogs.filter((dog) => dog.isFavorite === false);
  const favorited = dogs.filter((dog) => dog.isFavorite === true);

  let filteredDogs = (() => {
    if (showComponent === "favorite-dogs") {
      return favorited;
    }

    if (showComponent === "unfavorite-dogs") {
      return unfavorited;
    }
    return dogs;
  })();

  const onClickFavorited = () => {
    if (showComponent === "favorite-dogs") {
      setShowComponent("all-dogs");
      return;
    }
    setShowComponent("favorite-dogs");
  };

  const onClickUnfavorited = () => {
    if (showComponent === "unfavorite-dogs") {
      setShowComponent("all-dogs");
      return;
    }
    setShowComponent("unfavorite-dogs");
  };

  const onClickCreateDog = () => {
    if (showComponent === "create-dog-form") {
      setShowComponent("all-dogs");
      return;
    }
    setShowComponent("create-dog-form");
  };

  useEffect(() => {
    refetchDogs();
  }, []);

  return (
    <DogContext.Provider
      value={{
        dogs,
        setDogs,
        onClickCreateDog,
        onClickFavorited,
        onClickUnfavorited,
        filteredDogs,
        favoriteDog,
        favoriteDogCount: favorited.length,
        unfavoriteDog,
        unfavoriteDogCount: unfavorited.length,
        deleteDog,
        addDog,
        showComponent,
        setShowComponent,
        refetchDogs,
        deleteDogFromDb,
        addDogToDb,
      }}
    >
      {children}
    </DogContext.Provider>
  );
}

export const useDogs = () => {
  return useContext(DogContext);
};
export default DogProvider;
