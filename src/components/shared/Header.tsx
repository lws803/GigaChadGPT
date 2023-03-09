import { SetStateAction } from "react";
import {
  Burger,
  Group,
  Header as MantineHeader,
  MediaQuery,
} from "@mantine/core";

export default function Header({ isMenuOpened, setIsMenuOpened }: Props) {
  return (
    <MediaQuery styles={{ display: "none" }} largerThan="sm">
      <MantineHeader height={{ base: 60, md: 0, sm: 0 }} p="md">
        <Group sx={() => ({ justifyContent: "flex-start", width: "100%" })}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={isMenuOpened}
              onClick={() => setIsMenuOpened((o) => !o)}
              size="sm"
              mr="xl"
            />
          </MediaQuery>
        </Group>
      </MantineHeader>
    </MediaQuery>
  );
}

type Props = {
  isMenuOpened: boolean;
  setIsMenuOpened: (value: SetStateAction<boolean>) => void;
};
