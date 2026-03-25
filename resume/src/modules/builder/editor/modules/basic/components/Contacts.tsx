/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, Fragment } from 'react';
import TextField from '@mui/material/TextField';

const Contacts = ({
  basicTabs,
  onChangeHandler,
}: {
  basicTabs: any;
  onChangeHandler: (value: any, key: string) => void;
}) => {
  return (
    <Fragment>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={basicTabs.name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'name');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Image URL"
        variant="outlined"
        fullWidth
        value={basicTabs.image}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'image');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={basicTabs.label}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'label');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={basicTabs.email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'email');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Website URL"
        variant="outlined"
        fullWidth
        value={basicTabs.url}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'url');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Phone"
        variant="outlined"
        fullWidth
        value={basicTabs.phone}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'phone');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Location"
        variant="outlined"
        fullWidth
        value={basicTabs.location.city}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const location = basicTabs.location;
          location.city = event.target.value;
          onChangeHandler(location, 'location');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Relevant Experience"
        variant="outlined"
        fullWidth
        value={basicTabs.relExp}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'relExp');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
      <TextField
        label="Total Experience"
        variant="outlined"
        fullWidth
        value={basicTabs.totalExp}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(event.target.value, 'totalExp');
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover fieldset': { borderColor: '#4f46e5' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
        }}
      />
    </Fragment>
  );
};

export default Contacts;
