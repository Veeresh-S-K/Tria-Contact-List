import React, { useMemo, useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Container, TextField,
  Card, CardContent, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, Box, CssBaseline, Tooltip, InputLabel, MenuItem, FormControl,
  Select, Collapse, Fab
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;

// helper functions
const onlyDigits = (s) => s.replace(/\D+/g, "");
const splitPhone = (full) => {
  const m = (full || "").match(/^\+?(\d{1,3})?(\d{10})$/);
  if (m) return { cc: m[1] || "91", local: m[2] || "" };
  const digits = onlyDigits(full || "");
  const local = digits.slice(-10);
  const cc = digits.slice(0, digits.length - 10) || "91";
  return { cc: cc.slice(0, 3) || "91", local };
};
const composePhone = (cc, local) =>
  `+${onlyDigits(cc).slice(0, 3)}${onlyDigits(local).slice(0, 10)}`;

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: darkMode ? "#80deea" : "#3f51b5" },
          secondary: { main: darkMode ? "#b388ff" : "#9c27b0" },
        },
        shape: { borderRadius: 8 },
      }),
    [darkMode]
  );

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ type: "all", value: null });
  const [groups, setGroups] = useState(["Friends", "Work"]);

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      phone: "+919876543210",
      email: "alice@example.com",
      notes: "Met at a robotics hackathon; ROS2 enthusiast.",
      group: "Work",
      favourite: true,
      expanded: false,
    },
    {
      id: 2,
      name: "Bob Smith",
      phone: "+919123456780",
      email: "bob@example.com",
      notes: "Helps with PCB designs; CAN bus wizard.",
      group: "Friends",
      favourite: false,
      expanded: false,
    },
  ]);

  const [openAdd, setOpenAdd] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const [addForm, setAddForm] = useState({
    name: "",
    phoneCC: "91",
    phoneLocal: "",
    email: "",
    notes: "",
    group: "",
  });
  const [addErr, setAddErr] = useState({
    phoneLocal: "",
    phoneCC: "",
    email: "",
  });

  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    phoneCC: "91",
    phoneLocal: "",
    email: "",
    notes: "",
    group: "",
  });
  const [editErr, setEditErr] = useState({
    phoneLocal: "",
    phoneCC: "",
    email: "",
  });

  const visibleContacts = useMemo(() => {
    let list = [...contacts];
    if (filter.type === "favourites")
      list = list.filter((c) => c.favourite);
    else if (filter.type === "group")
      list = list.filter((c) => c.group === filter.value);
    const q = search.toLowerCase();
    if (q)
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
      );
    return list;
  }, [contacts, search, filter]);

  const toggleFavourite = (id) =>
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, favourite: !c.favourite } : c
      )
    );

  const toggleExpand = (id) =>
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, expanded: !c.expanded }
          : { ...c, expanded: false }
      )
    );

  const deleteContact = (id) =>
    setContacts((prev) => prev.filter((c) => c.id !== id));

  const addGroup = () => {
    const name = prompt("Enter new group name:");
    if (name && !groups.includes(name)) setGroups([...groups, name]);
  };

  const validatePhoneCC = (cc) => {
    const clean = onlyDigits(cc).slice(0, 3);
    return { value: clean, error: clean.length === 0 ? "Required" : "" };
  };
  const validatePhoneLocal = (local) => {
    const clean = onlyDigits(local).slice(0, 10);
    let error = "";
    if (clean.length && clean.length < 10) error = "Enter 10 digits";
    return { value: clean, error };
  };
  const validateEmail = (email) => {
    const ok = email === "" || email.includes("@");
    return { value: email, error: ok ? "" : "Must contain @" };
  };

  const onAddChange = (field) => (e) => {
    let val = e.target.value;
    if (field === "phoneCC") {
      const { value, error } = validatePhoneCC(val);
      setAddForm((f) => ({ ...f, phoneCC: value }));
      setAddErr((e) => ({ ...e, phoneCC: error }));
      return;
    }
    if (field === "phoneLocal") {
      const { value, error } = validatePhoneLocal(val);
      setAddForm((f) => ({ ...f, phoneLocal: value }));
      setAddErr((e) => ({ ...e, phoneLocal: error }));
      return;
    }
    if (field === "email") {
      const { value, error } = validateEmail(val);
      setAddForm((f) => ({ ...f, email: value }));
      setAddErr((e) => ({ ...e, email: error }));
      return;
    }
    setAddForm((f) => ({ ...f, [field]: val }));
  };

  const addContact = () => {
    const cc = validatePhoneCC(addForm.phoneCC);
    const loc = validatePhoneLocal(addForm.phoneLocal);
    const em = validateEmail(addForm.email);
    setAddErr({ phoneCC: cc.error, phoneLocal: loc.error, email: em.error });
    if (cc.error || loc.error || em.error || !addForm.name.trim()) return;

    const phone = composePhone(cc.value, loc.value);
    const contact = {
      id: contacts.length ? Math.max(...contacts.map((x) => x.id)) + 1 : 1,
      name: addForm.name.trim(),
      phone,
      email: addForm.email.trim(),
      notes: addForm.notes.trim(),
      group: addForm.group || "",
      favourite: false,
      expanded: false,
    };
    setContacts((prev) => [...prev, contact]);
    if (contact.group && !groups.includes(contact.group))
      setGroups((g) => [...g, contact.group]);
    setOpenAdd(false);
    setAddForm({
      name: "",
      phoneCC: "91",
      phoneLocal: "",
      email: "",
      notes: "",
      group: "",
    });
    setAddErr({ phoneLocal: "", phoneCC: "", email: "" });
  };

  const openEdit = (c) => {
    const { cc, local } = splitPhone(c.phone);
    setEditForm({
      id: c.id,
      name: c.name,
      phoneCC: cc,
      phoneLocal: local,
      email: c.email,
      notes: c.notes,
      group: c.group || "",
    });
    setEditErr({ phoneLocal: "", phoneCC: "", email: "" });
    setEditContact(c);
  };

  const onEditChange = (field) => (e) => {
    let val = e.target.value;
    if (field === "phoneCC") {
      const { value, error } = validatePhoneCC(val);
      setEditForm((f) => ({ ...f, phoneCC: value }));
      setEditErr((er) => ({ ...er, phoneCC: error }));
      return;
    }
    if (field === "phoneLocal") {
      const { value, error } = validatePhoneLocal(val);
      setEditForm((f) => ({ ...f, phoneLocal: value }));
      setEditErr((er) => ({ ...er, phoneLocal: error }));
      return;
    }
    if (field === "email") {
      const { value, error } = validateEmail(val);
      setEditForm((f) => ({ ...f, email: value }));
      setEditErr((er) => ({ ...er, email: error }));
      return;
    }
    setEditForm((f) => ({ ...f, [field]: val }));
  };

  const updateContact = () => {
    const cc = validatePhoneCC(editForm.phoneCC);
    const loc = validatePhoneLocal(editForm.phoneLocal);
    const em = validateEmail(editForm.email);
    setEditErr({ phoneCC: cc.error, phoneLocal: loc.error, email: em.error });
    if (cc.error || loc.error || em.error || !editForm.name.trim()) return;

    const phone = composePhone(cc.value, loc.value);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === editForm.id
          ? {
              ...c,
              name: editForm.name.trim(),
              phone,
              email: editForm.email.trim(),
              notes: editForm.notes.trim(),
              group: editForm.group,
            }
          : c
      )
    );
    setEditContact(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar
        position="sticky"
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg,#1a237e,#263238)"
              : "linear-gradient(90deg,#2196F3,#9C27B0)",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={() => setDrawerOpen((o) => !o)}>
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Contact List
          </Typography>

          <Box display="flex" alignItems="center" mr={2}>
            <SearchIcon />
            <TextField
              size="small"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 260,
                "& .MuiInputBase-root": {
                  background: theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "#fff",
                  borderRadius: 8,
                },
              }}
            />
          </Box>
{/* New Sun–Moon Slider (fixed layering & visibility, smaller knob) */}
<Box
  sx={{
    position: "relative",
    width: 65,
    height: 34,
    borderRadius: 20,
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    px: "5px",
    overflow: "hidden",
  }}
  onClick={() => setDarkMode((d) => !d)}
>
  {/* Sun icon (light mode) */}
  <Typography
    sx={{
      color: "#000",
      opacity: darkMode ? 0 : 1,
      transition: "opacity 0.3s",
      fontSize: 18,
      position: "absolute",
      left: 4,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2,
    }}
  >
    🌝
  </Typography>

  {/* Moon icon (dark mode) */}
  <Typography
    sx={{
      color: "#fff",
      opacity: darkMode ? 1 : 0,
      transition: "opacity 0.3s",
      fontSize: 18,
      position: "absolute",
      right: 4,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2,
    }}
  >
    🌚
  </Typography>

  {/* Smaller Slider Knob */}
  <Box
    sx={{
      position: "absolute",
      top: 7,                     // 👈 raised slightly to keep it centered
      left: darkMode ? "38px" : "6px", // 👈 adjusted for smaller size
      width: 20,                  // 👈 smaller diameter
      height: 20,                 // 👈 smaller diameter
      borderRadius: "50%",
      background: "#fff",
      border: "2px solid #000",
      boxShadow: "0 0 6px rgba(0,0,0,0.4)",
      transition: "left 0.3s ease",
      zIndex: 1,
    }}
  />
</Box>

        </Toolbar>
      </AppBar>
      
      {/* Collapsible Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : 0,
            overflowX: "hidden",
            transition: "width 0.3s ease",
            boxSizing: "border-box",
            borderRight: 0,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(180deg,#0d1117,#121212)"
                : "#fafafa",
          },
        }}
        open={drawerOpen}
      >
        <Toolbar />
        <Box sx={{ p: 1 }}>
          <List dense>
            <ListItemButton
              selected={filter.type === "all"}
              onClick={() => setFilter({ type: "all", value: null })}
            >
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="All Contacts" />
            </ListItemButton>

            <ListItemButton
              selected={filter.type === "favourites"}
              onClick={() => setFilter({ type: "favourites", value: null })}
            >
              <ListItemIcon>
                <FavoriteIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Favourites" />
            </ListItemButton>
          </List>

          <Divider sx={{ my: 1 }} />
          <Typography variant="overline" sx={{ pl: 2 }}>
            Groups
          </Typography>
          <List dense>
            {groups.map((g) => (
              <ListItemButton
                key={g}
                selected={filter.type === "group" && filter.value === g}
                onClick={() => setFilter({ type: "group", value: g })}
              >
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary={g} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={addGroup}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Group" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          transition: "margin-left .3s ease",
          minHeight: "calc(100vh - 64px)",
          background: theme.palette.mode === "dark"
            ? "radial-gradient(circle at 30% 70%,rgba(124,77,255,0.1),transparent)"
            : "#f5f6fa",
        }}
      >
        <Container sx={{ py: 4 }}>
          {visibleContacts.map((c) => (
            <Card
              key={c.id}
              onClick={() => toggleExpand(c.id)}
              sx={{
                borderRadius: 6,
                mb: 2,
                cursor: "pointer",
                width: "100%",
                boxShadow: theme.palette.mode === "dark"
                  ? "0 0 12px rgba(255,255,255,0.08)"
                  : "0 0 10px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, minWidth: 160 }}
                    >
                      {c.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.phone}
                    </Typography>
                  </Box>

                  <Box onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit Contact">
                      <IconButton onClick={() => openEdit(c)}>
                        <EditIcon sx={{ opacity: 0.85 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip
                      title={
                        c.favourite
                          ? "Remove from favourites"
                          : "Add to favourites"
                      }
                    >
                      <IconButton onClick={() => toggleFavourite(c.id)}>
                        {c.favourite ? (
                          <StarIcon color="warning" />
                        ) : (
                          <StarBorderIcon sx={{ opacity: 0.6 }} />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Contact">
                      <IconButton color="error" onClick={() => deleteContact(c.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Collapse in={c.expanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 1,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Email:</strong> {c.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Notes:</strong>{" "}
                      {c.notes || "No notes available"}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Container>
      </Box>

      {/* Add Contact Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField label="Name *" value={addForm.name} onChange={onAddChange("name")} />
            <Box display="flex" gap={2}>
              <TextField
                label="Country Code *"
                value={addForm.phoneCC}
                onChange={onAddChange("phoneCC")}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 0.5 }}>+</Box>,
                  inputProps: { inputMode: "numeric", pattern: "\\d*", maxLength: 3 },
                }}
                error={!!addErr.phoneCC}
                helperText={addErr.phoneCC || "Max 3 digits"}
                sx={{ width: 140 }}
              />
              <TextField
                label="Phone (10 digits) *"
                value={addForm.phoneLocal}
                onChange={onAddChange("phoneLocal")}
                InputProps={{
                  inputProps: { inputMode: "numeric", pattern: "\\d*", maxLength: 10 },
                }}
                error={!!addErr.phoneLocal}
                helperText={addErr.phoneLocal || "Numbers only"}
                fullWidth
              />
            </Box>
            <TextField
              label="Email"
              value={addForm.email}
              onChange={onAddChange("email")}
              error={!!addErr.email}
              helperText={addErr.email || "Must contain @ if provided"}
            />
            <FormControl>
              <InputLabel id="group-label">Group</InputLabel>
              <Select
                labelId="group-label"
                label="Group"
                value={addForm.group}
                onChange={onAddChange("group")}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {groups.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={addForm.notes}
              onChange={onAddChange("notes")}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenAdd(false);
              setAddForm({
                name: "",
                phoneCC: "91",
                phoneLocal: "",
                email: "",
                notes: "",
                group: "",
              });
              setAddErr({ phoneLocal: "", phoneCC: "", email: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={addContact}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog
        open={!!editContact}
        onClose={() => setEditContact(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent dividers>
          {editContact && (
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                label="Name *"
                value={editForm.name}
                onChange={onEditChange("name")}
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Country Code *"
                  value={editForm.phoneCC}
                  onChange={onEditChange("phoneCC")}
                  InputProps={{
                    startAdornment: <Box component="span" sx={{ mr: 0.5 }}>+</Box>,
                    inputProps: { inputMode: "numeric", pattern: "\\d*", maxLength: 3 },
                  }}
                  error={!!editErr.phoneCC}
                  helperText={editErr.phoneCC || "Max 3 digits"}
                  sx={{ width: 140 }}
                />
                <TextField
                  label="Phone (10 digits) *"
                  value={editForm.phoneLocal}
                  onChange={onEditChange("phoneLocal")}
                  InputProps={{
                    inputProps: { inputMode: "numeric", pattern: "\\d*", maxLength: 10 },
                  }}
                  error={!!editErr.phoneLocal}
                  helperText={editErr.phoneLocal || "Numbers only"}
                  fullWidth
                />
              </Box>
              <TextField
                label="Email"
                value={editForm.email}
                onChange={onEditChange("email")}
                error={!!editErr.email}
                helperText={editErr.email || "Must contain @ if provided"}
              />
              <FormControl>
                <InputLabel id="group-label-edit">Group</InputLabel>
                <Select
                  labelId="group-label-edit"
                  label="Group"
                  value={editForm.group}
                  onChange={onEditChange("group")}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {groups.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Notes"
                multiline
                minRows={3}
                value={editForm.notes}
                onChange={onEditChange("notes")}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditContact(null);
              setEditForm({
                id: null,
                name: "",
                phoneCC: "91",
                phoneLocal: "",
                email: "",
                notes: "",
                group: "",
              });
              setEditErr({ phoneLocal: "", phoneCC: "", email: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={updateContact}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Tooltip title="Add Contact">
        <Fab
          color="primary"
          onClick={() => setOpenAdd(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </ThemeProvider>
  );
}
