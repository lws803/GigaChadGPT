import { SetStateAction } from "react";
import {
  Burger,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Title,
} from "@mantine/core";

import { Persona, personaDropdownChoices } from "@/modules/openai/personas";

export default function Header({
  isMenuOpened,
  setIsMenuOpened,
  persona,
}: Props) {
  return (
    <MediaQuery styles={{ display: "none" }} largerThan="sm">
      <MantineHeader height={{ base: 60, md: 0, sm: 0 }} p="md">
        <Group sx={() => ({ justifyContent: "space-between", width: "100%" })}>
          <Burger
            opened={isMenuOpened}
            onClick={() => setIsMenuOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
          <Title order={5}>
            {
              personaDropdownChoices.find(
                (currPersona) => currPersona.value === persona
              )?.label
            }
          </Title>
          <Burger
            sx={() => ({ visibility: "hidden" })}
            opened={false}
            size="sm"
            mr="xl"
          />
        </Group>
      </MantineHeader>
    </MediaQuery>
  );
}

type Props = {
  isMenuOpened: boolean;
  setIsMenuOpened: (value: SetStateAction<boolean>) => void;
  persona: Persona;
};
