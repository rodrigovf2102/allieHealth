import { Alert, Box, Button, TextField } from "@mui/material";
import useAxios from "axios-hooks";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

type Props = {
  onSubmit: () => void;
};

const CreateForm = ({ onSubmit }: Props) => {
  const { register, handleSubmit } = useForm();
  const [{ loading, error }, executePost] = useAxios(
    {
      url: `${process.env.REACT_APP_SERVER_BASE_URL}/users`,
      method: "POST",
    },
    { manual: true },
  );
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const onFormSubmit = async (data: FieldValues) => {
    try {
      await executePost({ data });
      onSubmit();
    } catch (error : any) {
      if(error.response.data) setErrorMessages(error.response.data)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {error && (
            <>
              {errorMessages.length > 0 ? errorMessages.map(msg => <Alert severity="error">{msg}</Alert>) : 
                <Alert severity="error">
                  Sorry - there was an error creating the user
                </Alert>} 
            </>
          )}
          <TextField
            label="First Name"
            variant="outlined"
            {...register("firstName")}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            {...register("lastName")}
          />
          <TextField label="Email" variant="outlined" {...register("email")} />
          <Button variant="contained" type="submit" disabled={loading}>
            Create User
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CreateForm;
