import React, { useEffect, useRef, useState } from "react";
import "../scenes/navbar/styles.css";
import {
    useTheme,
    useMediaQuery,
    Icon,
} from "@mui/material";
import {
    Clear,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Debounce from "./Debounce";
import FriendRequest from "components/FriendRequest";

const SearchBar = (prop) => {
    const [searchUserList, setSearchUserList] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const token = useSelector((state) => state.token);
    // const debounceGetSearch = Debounce(getSearchResult, 500);
    const useSearchStarwarsHero = () => Debounce((text) => getSearchResult(text));
    const { inputText, setInputText } = useSearchStarwarsHero();
    const refClick = useRef(null);

    /*Outside search box click to set search list null */
    const handleClickOutside = (e) => {
        if (refClick.current) {
            if (!refClick.current.contains(e.target)) {
                setInputText("");
                setSearchUserList([]);
            }
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside, true);
    }, [])

    const routeChange = (userId) => {
        setInputText("");
        setSearchUserList([]);
        let path = `/profile/${userId}`;
        navigate(path);
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

    return (
        <div ref={refClick}>
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
                                <li key={_id}>
                                    <button className="btn-list primary" key={_id + 1} onClick={() => routeChange(_id)}>
                                        <img src={('http://localhost:3001/assets/' + picturePath)} className="img-profile" />
                                        <ListItemText
                                            className="lst-items"
                                            primary={`${firstName} ${lastName}`}
                                            secondary={`${occupation}-${location}`}
                                        />
                                    </button>
                                    {(user._id !== _id) && <FriendRequest friendId={_id} />}
                                </li>
                            );
                        }
                    )}
            </List>
        </div>
    )
}

export default SearchBar;