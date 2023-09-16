import { Group, Text } from "@mantine/core";

export default function AnnouncementBanner() {
  return (
    <Group
      sx={(theme) => ({
        padding: "4px 0px",
        justifyContent: "center",
        gap: "8px",
        borderRadius: "4px",
        marginBottom: "4px",
        backgroundColor:
          theme.colorScheme === "light"
            ? theme.colors.orange[0]
            : theme.colors.gray[9],
      })}
    >
      <Text align="center">
        Check out <a href="https://www.beloga.xyz/">Beloga</a> today for a more
        research-friendly use case 🎉
      </Text>
    </Group>
  );
}
