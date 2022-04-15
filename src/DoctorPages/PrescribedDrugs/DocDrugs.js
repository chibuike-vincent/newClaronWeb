import React, {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import * as API from "../../Api/DoctorApi";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip({email, drugs}) {
  const theme = useTheme();
  const [drugsRequest, setDrugsRequest] = useState([]);
  const [names, setNames] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("");
  const [total, setTotal] = useState(null);

  

  useEffect(() => {
    let validDrugsArr = []
    console.log(drugs, "aaaaaaa")
       drugs.map((item, index) => {
        validDrugsArr.push(`${item.name} GHS${item.unitprice}`)
       })
       setNames(validDrugsArr)
  }, [drugs]);

  console.log(names, "validDrugsArr")

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDrugsRequest(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const sendDrugsRequest = async() => {
    var lab = [];
    drugsRequest.map((item, index)=>{
      lab[index] = {
        name: item.split("GHS")[0].trim(),
        qty: '1',
        unitprice: parseInt(item.split("GHS")[1]),
        charges: total
      };
    })

    setLoading(true);
    try {
      const response = await API.sendRequestDrug(email, lab);
      console.log(response, "ggggggg")
      if (response.success) {
        setLoading(false);
        setColor("green")
        setMessage("Request successfully sent.", "fffff");
       
      } else {
        setColor("red")
        setMessage(response.message, "fffff");
        setLoading(false);
      }
    } catch (e) {
      setColor("red")
      setMessage(e.message, "rrrrrr");
      setLoading(false);
    }
  }

  return (
    <div>
      <p
            style={{
              color: color,
              marginTop: 5,
              textAlign: "center",
              fontSize: 20,
              paddingBottom: 10,
            }}
          >
            {message ? message : ""}
          </p>
      <FormControl sx={{ m: 1, width: 550 }}>
        <InputLabel id="demo-multiple-chip-label">Tests</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={drugsRequest}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, drugsRequest, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button className="doc-submit-test" onClick={sendDrugsRequest} >{ loading ? "Sending request..." : "Submit"}</button>
    </div>
  );
}
