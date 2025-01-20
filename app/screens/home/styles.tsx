import colors from "@/app/constants/colors";
import { Dimensions, Platform, StyleSheet } from "react-native";

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryText,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primaryText,
    },
    searchBar: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        elevation: 2,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 3,
        borderColor: colors.primary,
        borderWidth: 1
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        width: "100%",
        color: colors.danger,
        fontSize: 14,
        marginBottom: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: colors.primary,
        width: 100,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    fabText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        marginBottom: 10,
    },
    cardContainer: {
        marginBottom: 10,
        marginRight: 10,
    },
});

export default styles;