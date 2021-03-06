import { types } from '../types/types';

const data = {
  "fieldset": [
    {
      "name": "Personal Details",
      "required": true,
      "open": true,
      "fields": [
        {
          "name": "work_type",
          "type": "select",
          "label": "Select type of work",
          "lang": "ru",
          "required": true,
          "options": [
            {
              "name": "Select from list",
              "value": "-1",
              "selected": true
            },
            {
              "name": "Fulltime",
              "value": "1",
              "selected": false
            },
            {
              "name": "Freelance",
              "value": "2",
              "selected": false
            }
          ]
        },
        {
          "name": "first_name",
          "type": "text",
          "palceholder": "First Name",
          "label": "First Name",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "Ivan"
        },
        {
          "name": "last_name",
          "type": "text",
          "placeholder": "Last Name",
          "label": "Last Name",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "Sidorov"
        },
        {
          "name": "email",
          "type": "email",
          "placeholder": "Email",
          "label": "Email",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "test@mail.com"
        },
        {
          "name": "phone",
          "type": "text",
          "placeholder": "Phone",
          "label": "Phone",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "+3"
        },
        {
          "name": "country",
          "type": "text",
          "placeholder": "Country",
          "label": "Country",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "Ukraine"
        },
        {
          "name": "city",
          "type": "text",
          "placeholder": "City",
          "label": "City",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "Kiev"
        },
        {
          "name": "address",
          "type": "text",
          "placeholder": "Address",
          "label": "Address",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,20}/",
          "value": "Teremki 18"
        },
        {
          "name": "postal_code",
          "type": "text",
          "placeholder": "Postal Code",
          "label": "Postal Code",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,10}/",
          "value": "00000"
        },
        {
          "name": "driving_license",
          "type": "text",
          "placeholder": "Driving License",
          "label": "Driving License",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,30}/",
          "value": "C, B"
        },
        {
          "name": "nationality",
          "type": "text",
          "placeholder": "Nationality",
          "label": "Nationality",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,30}/",
          "value": "Ukrainian"
        },
        {
          "name": "place_birth",
          "type": "text",
          "placeholder": "Place Of Birth",
          "label": "Place Of Birth",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,30}/",
          "value": "Ukraine"
        },
        {
          "name": "date_birth",
          "type": "text",
          "placeholder": "Date Of Birth",
          "label": "Date Of Birth",
          "lang": "en",
          "required": true,
          "validation": "/[A-Za-z\\s]{3,30}/",
          "value": "23.04.1991"
        },
      ]
    },
    {
      "name": "Professional Summary",
      "required": true,
      "open": true,
      "fields": [
        {
          "name": "profile",
          "type": "textarea",
          "label": "Profile",
          "lang": "en",
          "required": false,
          "validation": "/.*/",
          "value": "Aome text here"
        }
      ]
    }
  ]
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const loadConfigData = (val) => async dispatch => {
  try {
    dispatch({
      type: types.SET_CONFIG_DATA,
      payload: data,
    })
  } catch (e) {
    console.log(e)
  }
};
