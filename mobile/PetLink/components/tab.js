import { Tab } from 'expo-router'

export default function Layout(){
    return(
        <Tabs>
            <Tab.Screen
            name="AppScreen"
            options={{
                title: 'App',
            }}
            />

             <Tab.Screen
            name="DenunciaChat"
            options={{
                title: 'Denúncia',
            }}
            />

        </Tabs>
    )
}