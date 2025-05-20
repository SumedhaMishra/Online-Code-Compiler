import React, { useRef, useState } from "react";
import { Controlled as CodeMirrorEditor } from "react-codemirror2";
import Axios from "axios";
import CodeMirror from "codemirror";
window.CodeMirror = CodeMirror;

//To use local storage so that the program doesn't disappear even after refresh.
import { useEffect } from "react";

import { Box, Button, Select, Text, Heading, Card, CardBody, Textarea } from "@chakra-ui/react";
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/material.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike"; // For C, C++, Java
import "codemirror/mode/perl/perl";
import "codemirror/mode/php/php";
import "codemirror/lib/codemirror.css";


//import "codemirror/addon/display/placeholder.js";
//Languages offered for the code compiler
const languageModes = {
   javascript: "javascript",
   python: "python",
   c: "text/x-csrc",
   cpp: "text/x-c++src",
   java: "text/x-java",
   perl: "perl",
   php : "php"
};

//Default codes for various languages of the code compiler
const defaultCodes = {
   javascript: "//JavaScript\nconsole.log('Hello, World!');",
   python: "# Python\nprint('Hello, World!')",
   c: "// C\n#include <stdio.h>\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}",
   cpp: "// C++\n#include <iostream>\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}",
   java: "// Please keep the public class name 'Main'!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
   php: "<?php\necho 'Hello, World!';\n?>",
   perl: "# Perl\nprint \"Hello, World!\\n\";"
};

//Themes offered for the UI/UX
const thememodes = {
   material: "material",
   PB: "3024-day",
   PBDark: "3024-night",
   DuotoneDark: "duotone-dark",
   DuotoneLight: "duotone-light",
   eclipse: "eclipse",
   elegant: "elegant",
   icecoder: "icecoder",
   Neo: "neo",
   Panda: "panda-syntax"
};

export default function OnlineCompiler() {
    // State variable to set user's source code
   const [userCode, setUserCode] = useState(defaultCodes["javascript"]);

    // State variable to set editor's default language
   const [language, setLanguage] = useState("javascript");

   //State value to change theme
   const [editorTheme, setTheme] = useState("material");

    // State variable to set user's output
   const [output, setOutput] = useState("");

    // State variable to manage loading state
   const [loading, setLoading] = useState(false);

   // State variable to accept user input
   //const [userInput, setUserInput] = useState("");

   //To completely on focus on the editor.
   const editorRef = useRef(null);


   //This function is used to focus on the editor.
   const focusEditor = () => {
      if (editorRef.current) {
         editorRef.current.focus(); //call the focus method on the editor
      }
   };

    // Function to call the compile endpoint
   function handleRun() {
      setLoading(true);
      if (userCode === "") {
            setOutput("Please enter code to compile.");
            setLoading(false);
            return;
      }

      Axios.post("http://localhost:5000/compile", {
            code: userCode,
            language: language,
            //input: userInput,
      }).then((res) => {
            setOutput(res.data.output);
        }).catch((error) => { // Handle any errors from the API
            setOutput("Error: " + error.message);
      }).finally(() => {
            setLoading(false);
      });
   }

    // Function to clear the output screen
   function clearOutput() {
      setOutput("");
   }

   useEffect(() => {
      const savedCode = localStorage.getItem("userCode");
      const savedLang = localStorage.getItem("language");
      if (savedCode) setUserCode(savedCode);
      if (savedLang) setLanguage(savedLang);
   }, []);

   useEffect(() => {
      localStorage.setItem("userCode", userCode);
      localStorage.setItem("language", language);
   }, [userCode, language]);

   //To show a warning when the user reloads or tries to close the tab
   useEffect(() => {
      const handleBeforeUnload = (e) => {
         e.preventDefault();
         e.returnValue = ''; 
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
      };
      }, []);


   return (
      <Box minH="100vh" bg="blue.50" p={4}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
               <Heading size="lg" color="blue.700">Online Compiler</Heading>
            <Select value={language} onChange={(e) => {
               const selectedLang = e.target.value;
               setLanguage(selectedLang);
               setUserCode(defaultCodes[selectedLang]);
            }} width="200px" borderColor="blue.300">
               {/*To choose between different languages */}
               <option value="javascript">JavaScript</option>
               <option value="python">Python</option>
               <option value="c">C</option>
               <option value="cpp">C++</option>
               <option value="java">Java</option>
               <option value="php">PHP</option>
               <option value="perl">Perl</option>
            </Select>
            <Select value={editorTheme} onChange={(e) => setTheme(e.target.value)} width="200px" borderColor="blue.300">
               {/* To choose between different themes */}
               <option value="material">Default Theme</option>
               <option value="PB">Pink and Blue</option>
               <option value="PBDark">Pink and Blue Dark</option>
               <option value="DuotoneDark">Duotone Dark</option>
               <option value="DuotoneLight">Duotone Light</option>
               <option value="eclipse">Eclipse</option>
               <option value="elegant">Elegant</option>
               <option value="icecoder">Icecoder</option>
               <option value="Neo">Neo</option>
               <option value="Panda">Panda Syntax</option>
            </Select>
            </Box>
            <Card mb={4}>
               <CardBody>
               <Box sx={{
                  ".CodeMirror":
                  {
                     height: "auto",
                     minHeight: 200,
                     fontSize: "14px",
                     lineHeight: "1.5"
                     }
               }}>
                  
                  <CodeMirrorEditor
                     value={userCode} // Set the value to userCode
                     options={{
                        mode: languageModes[language],
                        theme: thememodes[editorTheme],
                        lineNumbers: true,
                        lineWrapping: true,
                        //Placeholder no longer needed.
                        //placeholder: "//Enter your code here"
                     }}
                     editorDidMount={(editor) => {
                        editorRef.current = editor; //Assign the editor instance to editor ref
                     }}
                     onBeforeChange={(editor, data, value) => {
                        setUserCode(value); // Update userCode state on change
                              
                           }}
                     />
                  </Box>
               </CardBody>
         </Card>
         <Button onClick={handleRun} ml={1} colorScheme="blue" isLoading={loading}> Run Code  </Button>
         <Button onClick={clearOutput} ml={2} colorScheme="red"> Clear Output </Button>
         <Button onClick={focusEditor} ml={2} colorScheme="pink">Focus Editor</Button>
         <Box mt={4} bg="white" p={4} borderRadius="md" boxShadow="md">
               <Text fontWeight="semibold" color="blue.700">Output:</Text>
               <Text mt={2} fontSize="sm" whiteSpace="pre-wrap">{output}</Text>
            </Box>
      </Box>
   );
}
