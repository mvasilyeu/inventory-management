'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Fab, Grid, Modal, Stack, Button, TextField, Paper, Typography, styled } from "@mui/material";
import { createSvgIcon } from '@mui/material/utils';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

export default function Home() {

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>,
    'Plus',
  );

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#1b2838',
    ...theme.typography.body2,
    width: '300px',
    height: '300px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
  }));

  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: '', order: '' });

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addItem(itemName.toLowerCase());
      setItemName('');
      handleClose();
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };

  const handleSort = (field) => {
    let order = 'asc';
    if (sortOrder.field === field && sortOrder.order === 'asc') {
      order = 'desc';
    }
    setSortOrder({ field, order });

    const sortedInventory = [...filteredInventory].sort((a, b) => {
      if (field === 'name') {
        if (order === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (field === 'quantity') {
        if (order === 'asc') {
          return a.quantity - b.quantity;
        } else {
          return b.quantity - a.quantity;
        }
      }
    });
    setFilteredInventory(sortedInventory);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor={"#171a21"}
      overflow="hidden"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="30vw"
          height="30vh"
          bgcolor="#1b2838"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6" color="#c7d5e0">Add Item</Typography>
          <Stack
            width="100%"
            direction="row"
            spacing={2}
          >
            <TextField
              sx={{ backgroundColor: "#2a475e" }}
              variant="filled"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
              margin="normal"
              autoFocus
              onKeyDown={handleKeyDown}
            />
            <Button sx={{ backgroundColor: "#2a475e" }} tabIndex={"5"} variant="contained" onClick={() => {
              addItem(itemName.toLowerCase())
              setItemName('')
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        width="100%"
        height="150px"
        bgcolor="#1b2838"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 2vw"
        marginBottom={2}
      >
        <Typography variant="h2" color="#c7d5e0">
          Your Pantry
        </Typography>
        <TextField
          sx={{ backgroundColor: "#2a475e", borderRadius: 1 }}
          variant="filled"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ marginRight: 1, color: "#c7d5e0" }} />
            )
          }}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<SortIcon />}
            sx={{ backgroundColor: "#2a475e", marginRight: 1 }}
            onClick={() => handleSort('name')}
          >
            Sort by Name
          </Button>
          <Button
            variant="contained"
            startIcon={<SortIcon />}
            sx={{ backgroundColor: "#2a475e" }}
            onClick={() => handleSort('quantity')}
          >
            Sort by Quantity
          </Button>
        </Box>
      </Box>
      <Box
        marginTop={"3vw"}
        marginLeft={"5vw"}
        sx={{ flexGrow: 1 }}
        overflow="auto"
        height="calc(100vh - 250px)"
        width="90%"
      >
        <Grid container>
          {filteredInventory.map(({ name, quantity }) => (
            <Grid
              xs={2}
              key={name}
              display={'flex'}
              margin="2vh"
            >
              <Item>
                <Stack direction={"column"} >
                  <Typography variant="h3" color="#c7d5e0" textAlign="center" >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Stack direction={"row"} height={"50px"} display="flex" alignItems="center" justifyContent={"center"}>
                    <Button size="small" variant="contained" onClick={() => { addItem(name) }}>
                      +
                    </Button>
                    <Typography marginLeft={"10px"} marginRight={"10px"} variant="h5" color="#c7d5e0" >
                      {quantity}
                    </Typography>
                    <Button style={{ width: 10 }} variant="contained" onClick={() => { removeItem(name) }}>
                      -
                    </Button>
                  </Stack>
                </Stack>
              </Item>
            </Grid>
          ))}
          <Grid xs={2} display={"flex"} alignItems="center" justifyContent={"center"} marginLeft={"2vh"}> <Item><Fab onClick={() => { handleOpen() }}><PlusIcon /></Fab></Item> </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

