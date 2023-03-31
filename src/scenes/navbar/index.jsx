import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  FormGroup,
  Button,
  Icon,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Delete,
  Clear,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate, useLocation } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Debounce from "../../components/Debounce";
import FriendRequest from "components/FriendRequest";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchUserList, setSearchUserList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;
  const token = useSelector((state) => state.token);

  const navigateHome = () => {
    // 👇️ navigate to /
    navigate('/home');
  };

  const routeChange = (userId) => {
    let path = `/profile/${userId}`;
    navigate(path);
    navigate(0);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 8 && e.currentTarget.value.length <= 1) {
      setSearchUserList([]);
      setInputText(e.keyCode);
    }
  };

  const getSearchResult = async (values) => {
    let data = [];
    if (values.length > 0 && values !== 8) {
      const savedUserResponse = await fetch(
        `http://localhost:3001/users/${values}/searchUser`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      try {
        data = await savedUserResponse.json();
      }
      catch (err) {
        console.log(err);
      }
    }

    data.length > 0 ? setSearchUserList([...data]) : setSearchUserList([]);
  };

  // const debounceGetSearch = Debounce(getSearchResult, 500);
  const useSearchStarwarsHero = () => Debounce((text) => getSearchResult(text));
  const { inputText, setInputText } = useSearchStarwarsHero();

  //setSearch
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem" height={"7vh"}>
        <Button
          onClick={() => navigateHome()}
        >
          <i
            className="fa fa-linkedin"
            aria-hidden="true"
            style={{ color: "#0077b5", fontSize: 50 }}
          ></i>
        </Button>

        <div>
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="2rem"
              padding="0.1rem 1rem"
              marginTop="1.7vh"
            >
              <input
                className="MuiInputBase-input css-yz9k0d-MuiInputBase-input input-name"
                placeholder="Search..."
                type="text"
                value={inputText.length > 0 ? inputText : ""}
                onChange={(e) => setInputText(e.currentTarget.value)}
                onKeyDown={(e) => onKeyDown(e)}
                // onKeyUp={(e) =>
                //   debounceGetSearch(e.target.value)
                // }
                autoFocus />
              <Icon>
                {
                  inputText.length > 0 &&
                  <Clear
                    className="clear-search"
                    onClick={() => (setInputText(""), setSearchUserList([]))}
                  ></Clear>
                }
              </Icon>
            </FlexBetween>
          )}
          <List className={searchUserList.length > 0 ? "search-box-container" : ""}>
            {searchUserList &&
              searchUserList?.map(
                ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                  return (
                    <>
                      <button className="btn-list primary" key={_id + 1} onClick={() => routeChange(_id)}>
                        <img src={('http://localhost:3001/assets/' + picturePath)} className="img-profile" />
                        <ListItemText
                          className="lst-items"
                          primary={`${firstName} ${lastName}`}
                          secondary={`${occupation}-${location}`}
                        />
                      </button>
                      {(user._id !== _id) && <FriendRequest friendId={_id} />}
                    </>
                  );
                }
              )}
          </List>
        </div>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {
        isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName.split(' ').slice(0, -1).join(' ')}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )
      }

      {/* MOBILE NAV */}
      {
        !isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
              <IconButton
                onClick={() => dispatch(setMode())}
                sx={{ fontSize: "25px" }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <Message sx={{ fontSize: "25px" }} />
              <Notifications sx={{ fontSize: "25px" }} />
              <Help sx={{ fontSize: "25px" }} />
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName.split(' ').slice(0, -1).join(' ')}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )
      }
    </FlexBetween >
  );
};

export default Navbar;
