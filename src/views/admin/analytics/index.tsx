"use client";

import MessageBoxChat from "../../../components/MessageBox";
// import { OpenAIModel } from "../../../types/types";
import {
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next'
import { MdAutoAwesome, MdPerson } from "react-icons/md";
import oneDay from "../../../assets/svg/24hrs.svg";
import oneWeek from "../../../assets/svg/week.svg";
import bg from "../../../assets/svg/bgFlash.svg";
import submit from "../../../assets/svg/submitAnalytics.svg";
import "./analytics.css";
import DotLoader from "components/chatLoader/chatLoader";
import { chatGptAPi } from "services/customAPI";
import Navbar from "../../../components/navbar";

export type questionAnsArray = {
  query: string;
  ans: string;
};

export default function Analytics() {
  
  // translation function
  const { t } = useTranslation();

  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  // Response message
  const [outputCode, setOutputCode] = useState<string>("");
  // ChatGPT model
  const [model, setModel] = useState<string>("today");
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [outputArray, setOutputArray] = useState<questionAnsArray[]>([]);

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const inputColor = useColorModeValue("navy.700", "white");

  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "whiteAlpha.100");
  const buttonShadow = useColorModeValue(
    "14px 27px 45px rgba(112, 144, 176, 0.2)",
    "none"
  );
  const textColor = useColorModeValue("navy.700", "white");
  const placeholderColor = useColorModeValue(
    { color: "gray.500" },
    { color: "whiteAlpha.600" }
  );

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [outputArray]);

  const handleTranslate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      setInputOnSubmit(inputCode);
      setOutputCode(" ");

      if (inputCode) {
        const data = {
          mode: model,
          input: inputCode,
        };
        const res: any = await chatGptAPi(data);
        console.log("Res", res);
        if (!res) {
          console.log(" Data not found");
          setOutputCode(
            "It seems like your response might have been cut off or there might be a typo. If you have any questions or need assistance, please provide more context or clarify your query, and I'll be happy to help!"
          );
        }
        if (res.success === false) {
          setInputCode("");
          setInputOnSubmit("");
          setOutputArray((prev: questionAnsArray[]) => [
            ...prev,
            {
              query: inputCode,
              ans: res.message,
            },
          ]);
        } else {
          // setOutputCode(res.data);
          setInputCode("");
          setInputOnSubmit("");
          setOutputArray((prev: questionAnsArray[]) => [
            ...prev,
            {
              query: inputCode,
              ans: res.data,
            },
          ]);
          // setOutputCode(res);
        }
      }
    } catch (e: any) {
      console.log("error", e.message);
      setOutputCode(
        "It seems like your response might have been cut off or there might be a typo. If you have any questions or need assistance, please provide more context or clarify your query, and I'll be happy to help!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const onTimeChange = (timeType: string) => {
    setModel(timeType);
    setOutputArray([]);
  };
  console.log("OutputArray", outputArray.length);

  return (
    <>
      <Navbar flag={false} brandText="Analytics" />
      <div
        className="analytics-page mt-4 dark:!bg-navy-800 dark:text-white"
        style={{
          // backgroundSize:"cover",
          // alignItems:"center",
          backgroundPosition:"center",
          backgroundRepeat:"no-repeat",
          backgroundSize:"350px 450px",
          backgroundImage: outputArray.length === 0 ? `url(${bg})` : "none",
        }}
      >
        {/* Model Change */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: "500",
            paddingLeft: "20px",
            paddingTop: "15px",
          }}
        >
          {t("Analytics")}
        </div>
        <Flex
          mx="auto"
          zIndex="2"
          w="max-content"
          mb="20px"
          borderRadius="14px"
          // backgroundColor="rgba(255, 255, 255, 0.4)"
        >
          <Flex
            cursor={"pointer"}
            transition="0.3s"
            justify={"center"}
            align="center"
            bg={model === "today" ? buttonBg : "transparent"}
            w="150px"
            h="50px"
            boxShadow={model === "today" ? buttonShadow : "none"}
            borderRadius="14px"
            color={textColor}
            fontSize="16px"
            fontWeight={"700"}
            onClick={() => onTimeChange("today")}
            border={model === "today" ? "1px solid" : "none"}
            borderColor="#50CD89"
            className="dark:!bg-navy-800"
          >
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              me="10px"
              h="30px"
              w="30px"
            >
              <img src={oneDay} width="25px" height="25px" />
            </Flex>
            24 {t("HRS")}
          </Flex>
          <Flex
            cursor={"pointer"}
            transition="0.3s"
            justify={"center"}
            align="center"
            bg={model === "lastWeek" ? buttonBg : "transparent"}
            w="150px"
            h="50px"
            boxShadow={model === "lastWeek" ? buttonShadow : "none"}
            borderRadius="14px"
            color={textColor}
            fontSize="16px"
            fontWeight={"700"}
            onClick={() => onTimeChange("lastWeek")}
            border={model === "lastWeek" ? "1px solid" : "none"}
            borderColor="#50CD89"
            className="dark:!bg-navy-800"
          >
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              me="10px"
              h="30px"
              w="30px"
            >
              <img src={oneWeek} width="25px" height="25px" />
            </Flex>
            {t("LAST WEEK")}
          </Flex>
          <Flex
            cursor={"pointer"}
            transition="0.3s"
            justify={"center"}
            align="center"
            bg={model === "lastMonth" ? buttonBg : "transparent"}
            w="150px"
            h="50px"
            boxShadow={model === "lastMonth" ? buttonShadow : "none"}
            borderRadius="14px"
            color={textColor}
            fontSize="16px"
            fontWeight={"700"}
            onClick={() => onTimeChange("lastMonth")}
            border={model === "lastMonth" ? "1px solid" : "none"}
            borderColor="#50CD89"
            className="dark:!bg-navy-800"
          >
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              me="10px"
              h="30px"
              w="30px"
            >
              <img src={oneWeek} width="25px" height="25px" />
            </Flex>
            {t("LAST MONTH")}
          </Flex>
        </Flex>
        {/* main box */}
        <div
          className="background-gtp-img"
          style={{
            display: "flex",
            // alignItems: "center",
            // width: "100%",
            marginLeft: "12.4%",
            // backgroundImage: outputArray.length === 0 ? `url(${bg})` : "none",
          }}
        >
          <Flex
            className="scroll-bar"
            direction="column"
            w="100%"
            mx="auto"
            display={outputCode ? "flex" : "none"}
            mb="10px"
            mt="10px"
            px="20px"
            height="55vh"
            overflowY="scroll"
            scrollbar-width="none"
          >
            {outputArray.map((out: any, index: any) => {
              return (
                <>
                  <Flex
                    key={index}
                    w="71.8%"
                    align={"center"}
                    mb="10px"
                    ps="10px"
                    ml="5%"
                  >
                    <Flex
                      borderRadius="50px"
                      justify="center"
                      align="center"
                      bg={"transparent"}
                      border="1px solid"
                      borderColor={borderColor}
                      me="20px"
                      h="40px"
                      minH="40px"
                      minW="40px"
                    >
                      <Icon
                        as={MdPerson}
                        width="20px"
                        height="20px"
                        color={brandColor}
                      />
                    </Flex>
                    <Flex
                      p="12px"
                      ps="22px"
                      w="100%"
                      zIndex={"2"}
                      style={{
                        borderRadius: "12px",
                        // boxShadow: "0px 2px 15px 0px rgba(62, 195, 164, 0.12)",
                      }}
                      border="1px solid"
                    >
                      <Text
                        color={textColor}
                        fontWeight="600"
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight={{ base: "24px", md: "26px" }}
                      >
                        {out.query}
                        <div ref={chatContainerRef} />
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex w="71.8%" ps="10px" pb="30px" ml="5%">
                    <Flex
                      borderRadius="50px"
                      justify="center"
                      align="center"
                      me="20px"
                      h="40px"
                      minH="40px"
                      minW="40px"
                      bg={
                        "linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
                      }
                    >
                      <Icon
                        as={MdAutoAwesome}
                        width="20px"
                        height="20px"
                        color="white"
                      />
                    </Flex>
                    {out.ans && (
                      <Flex
                        p="22px"
                        ps="0px"
                        w="100%"
                        zIndex={"2"}
                        style={{
                          borderRadius: "12px",
                          boxShadow:
                            "0px 2px 15px 0px rgba(62, 195, 164, 0.12)",
                        }}
                        // border="1px solid"
                      >
                        <MessageBoxChat output={out.ans} />
                      </Flex>
                    )}
                  </Flex>
                </>
              );
            })}
            {inputOnSubmit && (
              <>
                <Flex w="71.8%" align={"center"} mb="10px" ps="10px" ml="5%">
                  <Flex
                    borderRadius="50px"
                    justify="center"
                    align="center"
                    bg={"transparent"}
                    border="1px solid"
                    borderColor={borderColor}
                    me="20px"
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdPerson}
                      width="20px"
                      height="20px"
                      color={brandColor}
                    />
                  </Flex>
                  <Flex
                    p="12px"
                    ps="22px"
                    w="100%"
                    zIndex={"2"}
                    border="1px solid"
                    borderRadius="12px"
                    style={
                      {
                        // boxShadow: "0px 2px 15px 0px rgba(62, 195, 164, 0.12)",
                      }
                    }
                  >
                    <Text
                      color={textColor}
                      fontWeight="600"
                      fontSize={{ base: "sm", md: "md" }}
                      lineHeight={{ base: "24px", md: "26px" }}
                    >
                      {inputOnSubmit}
                    </Text>
                  </Flex>
                </Flex>
                <Flex w="71.8%" ps="10px" pb="20px" ml="5%">
                  <Flex
                    borderRadius="50px"
                    justify="center"
                    align="center"
                    bg={
                      "linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
                    }
                    me="20px"
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdAutoAwesome}
                      width="20px"
                      height="20px"
                      color="white"
                    />
                  </Flex>
                  {false && (
                    <Flex
                      p="22px"
                      ps="0px"
                      w="100%"
                      zIndex={"2"}
                      // border="1px solid"
                      style={{
                        borderRadius: "12px",
                        boxShadow: "0px 2px 15px 0px rgba(62, 195, 164, 0.12)",
                      }}
                    >
                      <MessageBoxChat output={outputCode} />
                    </Flex>
                  )}
                </Flex>
              </>
            )}
          </Flex>
        </div>
        <div className="px-10" style={{ position: "relative" }}>
          <>
            {loading && (
              <div
                style={{ position: "absolute", bottom: "5%", right: "20%" }}
              >
                {<DotLoader />}
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                marginLeft: "9%",
              }}
            >
              <form
                className="gpt-input-button"
                onSubmit={handleTranslate}
                style={{ border: "1px solid", borderRadius: "45px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Input
                    onSubmit={handleTranslate}
                    backgroundColor="rgba(0, 0, 0, 0.0)"
                    value={inputCode}
                    minH="54px"
                    h="54px"
                    flex="90%"
                    w="100%"
                    borderRadius="45px"
                    p="15px 20px"
                    me="15px"
                    fontSize="sm"
                    fontWeight="500"
                    _placeholder={placeholderColor}
                    placeholder={t("Type your message here...")}
                    onChange={handleChange}
                    style={{ outline: "none" }}
                    autoFocus
                    isDisabled={loading}
                  />
                  {!loading && (
                    <Button
                      style={{
                        background: "#E8FFF3",
                      }}
                      width="20%"
                      variant="primary"
                      py="20px"
                      px="16px"
                      fontSize="sm"
                      borderRadius="45px"
                      fontWeight="700"
                      ms="auto"
                      w={{ base: "160px", md: "210px" }}
                      h="54px"
                      // backgroundColor="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
                      _hover={{
                        boxShadow: "0px 21px 27px -10px !important",
                        background: "#E8FFF3",
                      }}
                      color="#118F5E"
                      onClick={handleTranslate}
                      //   isLoading={loading ? true : false}
                    >
                      {t("Submit")}
                      <img
                        src={submit}
                        alt="Submit"
                        height="20px"
                        width="20px"
                        style={{ paddingLeft: "5px" }}
                      />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
