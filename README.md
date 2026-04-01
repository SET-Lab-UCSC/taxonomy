# Spatial Interaction Vault
Web visualization of XR interaction techniques.

## Development Instructions
Clone repository locally or use GitHub Codespaces to launch a development environment
### Install Dependencies
`npm install`
### Run Locally
`npm run dev`
### Build and Deploy
`npm run build`
Commit changes to deploy with GitHub Pages
## Observation Instructions
### GIF Collection
1. Obtain observation on headset: Meta button + Right Trigger to record.
2. Move recording to local machine. **NOTE**: Headset must be off to copy video to local machine.
3. Convert video to GIF file format. **NOTE**: Decrease resolution before download so Cloudflare can accept GIF.
4. Move GIF to Cloudflare account -> Media -> Images -> Hosted images.
### Adding Observation
1. Add observations on the given Google Sheet.
2. If any new changes, download the sheet as a `.csv` file.
3. Add `.csv` file to the `static` folder. 
NOTE: Make sure the `.csv` filename stays the same ie. \\ 
`Taxonomy Observations - Applications.csv` \\
`Taxonomy Observatiosn - Observations.csv` \\ 
4. Repeat steps 3-5 from *Development Instructions* to deploy new observations to Github Pages.
