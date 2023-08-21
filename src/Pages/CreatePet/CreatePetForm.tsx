import * as React from "react";
import {
  TextField,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import PetImageList from "./PetImageList";
import { useAddPetMutation } from "../../store/services/petshop";
import ErrorAlert from "../../components/ErrorAlert";

export enum PetType {
  Cat = "CAT",
  Dog = "DOG",
}
interface CreatePetFormProps {
  setShowCreatePetForm: React.Dispatch<React.SetStateAction<boolean>>;
  setPetId: React.Dispatch<React.SetStateAction<string>>;
}

export default function CreatePetForm({
  setShowCreatePetForm,
  setPetId,
}: CreatePetFormProps) {
  const [petName, setPetName] = useState<string>("");
  const [petDescription, setPetDescription] = useState<string>("");
  const [petAge, setPetAge] = useState<number>(0);
  const [petType, setPetType] = useState<PetType>(PetType.Cat);
  const [petImage, setPetImage] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [addPet] = useAddPetMutation();

  const validateForm = (): string =>
    [
      petName.length < 3 ? "Name must be at least three characters long" : "",
      petDescription.length < 15
        ? "Description must be at least fifteen characters long"
        : "",
      petAge < 0 ? "Age must be a positive number" : "",
      petImage.length < 1 ? "You must select an image" : "",
    ]
      .filter((error) => error !== "")
      .join(". ");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      setErrorMessage((prevState) => errors);
      return;
    }

    setErrorMessage((prevState) => "");

    try {
      const pet = await addPet({
        name: petName,
        description: petDescription,
        age: petAge,
        type: petType,
        photoLink: petImage,
      }).unwrap();
      if (pet) {
        setPetName((prevState) => "");
        setPetDescription((prevState) => "");
        setPetAge((prevState) => 0);
        setPetType((prevState) => PetType.Cat);
        setPetImage((prevState) => "");

        setShowCreatePetForm((prevState) => !prevState);
        setPetId((prevState) => pet.id);
      }
    } catch (error) {
      setErrorMessage(`Something unexpected happened. Pet not created!`);
    }
  };

  return (
    <>
      {errorMessage.length > 0 && <ErrorAlert message={errorMessage} />}
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50ch" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div>
          <TextField
            required
            id="name"
            label="Name"
            variant="outlined"
            value={petName}
            placeholder="Your pet's name"
            onChange={(event) => setPetName(event.target.value)}
            fullWidth
            helperText={"Name must be at least three characters long"}
            error={petName.length < 3}
          />
        </div>
        <div>
          <TextField
            required
            id="description"
            label="Description"
            variant="outlined"
            value={petDescription}
            onChange={(event) => setPetDescription(event.target.value)}
            placeholder="Your pet's description"
            helperText={"Description must be at least fifteen characters long"}
            multiline
            maxRows={3}
            error={petDescription.length < 15}
            fullWidth
          />
        </div>
        <div>
          <TextField
            required
            id="pet-age"
            label="Age"
            type="number"
            variant="outlined"
            aria-valuemin={0}
            value={petAge}
            helperText={"Age must be at least 0"}
            fullWidth
            onChange={(event) => setPetAge(Number(event.target.value))}
            error={petAge < 0}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div>
          <FormControl fullWidth sx={{ width: 400 }}>
            <FormLabel id="pet-type">Pet Type</FormLabel>
            <RadioGroup row aria-labelledby="pet-type" name="pet-type">
              <FormControlLabel
                checked={petType === PetType.Cat}
                value={PetType.Cat}
                control={<Radio />}
                label="Cat"
                onClick={(event) => setPetType(PetType.Cat)}
              />
              <FormControlLabel
                value={PetType.Dog}
                control={<Radio />}
                label="Dog"
                onClick={(event) => setPetType(PetType.Dog)}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <PetImageList petType={petType} setPetImage={setPetImage} />
          <Button id="submit" variant="contained" color="primary" type="submit">
            {" "}
            Submit{" "}
          </Button>
        </div>
      </Box>
    </>
  );
}
