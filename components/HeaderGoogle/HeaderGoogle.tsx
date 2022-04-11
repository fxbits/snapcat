import { ActionIcon, Group, Menu, Stack, TextInput } from "@mantine/core";
import { Search } from "tabler-icons-react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";
import Link from 'next/link';


interface Props{
    searchPosition: (address: string) => void;
}   

const HeaderGoogle = (props: Props) => {
    const { user } = useUser();
    const [addressName, setAddressName] = useState<string>("");

    const searchPlace = (): void =>{
       props.searchPosition(addressName);   
    }
    
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
                            p={'lg'}
                            required
                            rightSection={   
                            <ActionIcon >
                                <Search onClick={searchPlace}/>
                            </ActionIcon>
                            }
                            onChange={(e)=>{setAddressName(e.target.value)}}
                        />
                    </form>
                </Group>
 
                <Group align="center" justify-content="space-between">
                    <p>Welcome {user!.name}</p>   
                    <Menu control={<ActionIcon > <Image src="/icon/user-icon.svg" width={40} height={40}></Image>
                        </ActionIcon>} position="bottom" size={1520} styles={{ body: { backgroundColor: '#FFDB3C', border:'#FFDB3C' } }}>
                            <Stack align="center"
                                sx={{backgroundColor:"#FFDB3C"}}>
                                <Link href="">Profile</Link>
                                <Link href="/api/auth/logout">Logout</Link>
                                <Group position="apart" >
                                    <Link href="">Privacy Policy*</Link>
                                    <Link href="">Terms of Service</Link>
                                </Group>
                            </Stack>  
                    </Menu>   
                </Group>
            </Group>
        </div>
    );
}

export default HeaderGoogle;
