import { StyleSheet } from 'react-native';

export const userDetailsStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 15, // Add some horizontal padding for better containment
        paddingTop: 20, // Add some top padding
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#e0e0e0', // Light gray background for back button
        borderRadius: 8,
        marginBottom: 15, // Add some space below the back button
    },
    headerContainer: {
        marginBottom: 20,
    },
    detailsContainer: {
        paddingHorizontal: 0, // Remove extra horizontal padding here
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        padding: 20,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    bold: {
        fontWeight: 'bold',
        color: '#333', // Darker text for better readability
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8, // Slightly more spacing between detail lines
        color: '#555', // Slightly lighter text for details
    },
    label: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5, // Add some space below the label
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10, // Adjust vertical padding
        paddingHorizontal: 12, // Adjust horizontal padding
        marginTop: 5,
        backgroundColor: '#f0f0f0', // Light gray background for input
        color: '#333',
        fontSize: 16,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 5,
        backgroundColor: '#f0f0f0', // Light gray background for dropdown
        justifyContent: 'center',
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
        maxHeight: 150,
        backgroundColor: 'white',
    },
    dropdownScroll: {
        padding: 5,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    saveButton: {
        backgroundColor: '#f5f5dc', // Light beige/brown
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 25,
    },
    cancelButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: '#333', // Dark text for buttons
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: "black",
    },
});