import {
  ActionIcon,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Search } from "tabler-icons-react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";
import Link from "next/link";


interface Props {
  searchPosition: (address: string) => void;
}

const HeaderGoogle = (props: Props) => {
  const { user } = useUser();
  const [addressName, setAddressName] = useState<string>("");

  const searchPlace = (): void => {
    props.searchPosition(addressName);
  };

  return (
    <div className="search">
      <Group position="apart">
        <Group align="center" justify-content="space-between">
          <Image src="/icon/header-icon.svg" width={36} height={46}></Image>
          <form>
            <TextInput
              type="search"
              placeholder="Search"
              radius="md"
              p={"lg"}
              required
              rightSection={
                <ActionIcon>
                  <Search onClick={searchPlace} />
                </ActionIcon>
              }
              onChange={(e) => {
                setAddressName(e.target.value);
              }}
            />
          </form>
        </Group>

        <Group align="center" justify-content="space-between">
          <Text
            sx={(theme) => ({
              [theme.fn.smallerThan("md")]: { display: "none" },
            })}
          >
            Welcome {user!.name}
          </Text>
          <Menu
            control={
              <ActionIcon>
                {" "}
                <Image
                  src="/icon/user-icon.svg"
                  width={40}
                  height={40}
                ></Image>{" "}
              </ActionIcon>
            }
            position="bottom"
            styles={(theme) => ({
              body: {
                width: "100vw",
                backgroundColor: "#FFDB3C",
                border:"#FFDB3C",
                [theme.fn.largerThan("md")]: { width: "20vw" },
              },
            })}
          >
            <Stack align="center" sx={{ backgroundColor: "#FFDB3C" }}>
              <Group direction="column" sx={{ fontWeight: "bold" }}>
                <Link href="">Profile</Link>
                <Link href="/api/auth/logout">Logout</Link>
              </Group>
              <Group position="apart">
                <Text>Made with &#10084; by fxbits</Text>
              </Group>
            </Stack>
          </Menu>
        </Group>
      </Group>
    </div>
  );
};

export default HeaderGoogle;
